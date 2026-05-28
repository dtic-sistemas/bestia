'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Duel, Pet, Vote } from '@/lib/types';
import { formatTimeRemaining, getDeviceFingerprint } from '@/lib/utils';

export default function DuelPage() {
  const params = useParams();
  const duelId = params.id as string;

  const [duel, setDuel] = useState<Duel | null>(null);
  const [pet1, setPet1] = useState<Pet | null>(null);
  const [pet2, setPet2] = useState<Pet | null>(null);
  const [votes1, setVotes1] = useState(0);
  const [votes2, setVotes2] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingFor, setVotingFor] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [voteResultModal, setVoteResultModal] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadDuel();
  }, [duelId]);

  useEffect(() => {
    if (!duel) return;

    const timer = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(duel.expires_at));
    }, 1000);

    return () => clearInterval(timer);
  }, [duel]);

  const loadDuel = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load duel
      const { data: duelData, error: duelError } = await supabase
        .from('duels')
        .select('*')
        .eq('id', duelId)
        .single();

      if (duelError || !duelData) {
        setError('Duel not found');
        setLoading(false);
        return;
      }

      setDuel(duelData);

      // Load both pets
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .in('id', [duelData.pet1_id, duelData.pet2_id]);

      if (petsError || !petsData) {
        setError('Failed to load pets');
        setLoading(false);
        return;
      }

      const pet1 = petsData.find((p) => p.id === duelData.pet1_id);
      const pet2 = petsData.find((p) => p.id === duelData.pet2_id);

      setPet1(pet1 || null);
      setPet2(pet2 || null);

      // Load vote counts
      const { count: count1 } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('duel_id', duelId)
        .eq('pet_id', duelData.pet1_id);

      const { count: count2 } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('duel_id', duelId)
        .eq('pet_id', duelData.pet2_id);

      setVotes1(count1 || 0);
      setVotes2(count2 || 0);

      setTimeRemaining(formatTimeRemaining(duelData.expires_at));

      // Check if already voted (using localStorage)
      const votedKey = `voted_${duelId}`;
      const hasVotedLocally = localStorage.getItem(votedKey) === 'true';
      if (hasVotedLocally) {
        setHasVoted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading duel');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (petId: string) => {
    if (hasVoted || !duel) return;

    setVotingFor(petId);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duelId,
          petId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error modal
        setVoteResultModal({
          type: 'error',
          message: data.error || 'Error al votar'
        });

        // If already voted, mark as voted
        if (data.error === 'Ya votaste en este duelo') {
          setHasVoted(true);
          localStorage.setItem(`voted_${duelId}`, 'true');
        }
        return;
      }

      // Show success modal
      setVoteResultModal({
        type: 'success',
        message: '¡Tu voto fue contado! 🎉'
      });

      setHasVoted(true);
      localStorage.setItem(`voted_${duelId}`, 'true');

      // Update vote counts
      if (petId === pet1?.id) {
        setVotes1(votes1 + 1);
      } else {
        setVotes2(votes2 + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al votar');
    } finally {
      setVotingFor(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando votación...</p>
      </div>
    );
  }

  if (error || !duel || !pet1 || !pet2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Votación no encontrada'}</p>
        </div>
      </div>
    );
  }

  const isClosed = new Date(duel.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">¿Cuál es más linda?</h1>
          <p className="text-lg text-gray-600">
            {isClosed ? '❌ Votación cerrada' : `⏱️ ${timeRemaining}`}
          </p>
        </div>

        {/* Voting Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pet 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-80 overflow-hidden">
              <img
                src={pet1.photo_url}
                alt={pet1.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{pet1.name}</h2>
              <p className="text-gray-600 mb-6 capitalize">
                {pet1.species === 'gato' && '🐱 Gato'}
                {pet1.species === 'perro' && '🐕 Perro'}
                {pet1.species === 'otro' && '🦎 Otro'}
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Votos</p>
                <p className="text-4xl font-bold text-indigo-600">{votes1}</p>
              </div>

              <button
                onClick={() => handleVote(pet1.id)}
                disabled={hasVoted || isClosed || votingFor !== null}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {votingFor === pet1.id ? '⏳ Votando...' : hasVoted ? '✓ Ya votaste' : 'Votar por mí'}
              </button>
            </div>
          </div>

          {/* Pet 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-80 overflow-hidden">
              <img
                src={pet2.photo_url}
                alt={pet2.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{pet2.name}</h2>
              <p className="text-gray-600 mb-6 capitalize">
                {pet2.species === 'gato' && '🐱 Gato'}
                {pet2.species === 'perro' && '🐕 Perro'}
                {pet2.species === 'otro' && '🦎 Otro'}
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Votos</p>
                <p className="text-4xl font-bold text-indigo-600">{votes2}</p>
              </div>

              <button
                onClick={() => handleVote(pet2.id)}
                disabled={hasVoted || isClosed || votingFor !== null}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {votingFor === pet2.id ? '⏳ Votando...' : hasVoted ? '✓ Ya votaste' : 'Votar por mí'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Vote Result Modal */}
        {voteResultModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
              <div className="mb-4">
                {voteResultModal.type === 'success' ? (
                  <div className="text-5xl mb-4">🎉</div>
                ) : (
                  <div className="text-5xl mb-4">ℹ️</div>
                )}
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                voteResultModal.type === 'success' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {voteResultModal.type === 'success' ? '¡Voto contado!' : 'Información'}
              </h2>
              <p className="text-gray-600 mb-6">{voteResultModal.message}</p>
              <button
                onClick={() => setVoteResultModal(null)}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
