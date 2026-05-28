'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Duel, Pet } from '@/lib/types';

export default function TrophyPage() {
  const params = useParams();
  const duelId = params.duelId as string;

  const [duel, setDuel] = useState<Duel | null>(null);
  const [winner, setWinner] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDuel();
  }, [duelId]);

  const loadDuel = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: duelData, error: duelError } = await supabase
        .from('duels')
        .select('*')
        .eq('id', duelId)
        .single();

      if (duelError || !duelData || !duelData.winner_id) {
        setError('Trofeo no disponible');
        setLoading(false);
        return;
      }

      setDuel(duelData);

      const { data: petData } = await supabase
        .from('pets')
        .select('*')
        .eq('id', duelData.winner_id)
        .single();

      setWinner(petData || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading trophy');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = () => {
    const element = document.getElementById('trophy-card');
    if (!element) return;

    // Simple copy to clipboard instruction
    alert('Para compartir este trofeo:\n1. Abre este screenshot\n2. Comparte en Instagram, WhatsApp, etc.');
  };

  const getFormattedDate = () => {
    if (!duel) return '';
    const date = new Date(duel.created_at);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando trofeo...</p>
      </div>
    );
  }

  if (error || !duel || !winner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Trofeo no encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Trophy Card */}
        <div
          id="trophy-card"
          className="bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-300 rounded-2xl shadow-2xl p-12 text-center"
        >
          {/* Crown */}
          <div className="text-8xl mb-6 drop-shadow-lg">👑</div>

          {/* Title */}
          <h1 className="text-4xl font-black text-gray-900 mb-4 drop-shadow-md">
            ¡CAMPEÓN!
          </h1>

          {/* Pet Info */}
          <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
            {/* Pet Photo */}
            <div className="w-40 h-40 mx-auto mb-6 rounded-lg overflow-hidden shadow-md">
              <img
                src={winner.photo_url}
                alt={winner.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Pet Name */}
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{winner.name}</h2>

            {/* Species */}
            <p className="text-xl text-gray-600 mb-6 capitalize">
              {winner.species === 'gato' && '🐱 Gato'}
              {winner.species === 'perro' && '🐕 Perro'}
              {winner.species === 'otro' && '🦎 Otro'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Votos totales</p>
                <p className="text-2xl font-bold text-indigo-600">{winner.total_votes}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Victorias</p>
                <p className="text-2xl font-bold text-green-600">{winner.wins}</p>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-8 shadow-md inline-block">
            <p className="text-gray-700 font-semibold text-lg">
              Ganador de BESTIA
            </p>
            <p className="text-gray-600 text-sm">
              {getFormattedDate()}
            </p>
          </div>

          {/* Footer */}
          <p className="text-gray-800 text-sm font-medium drop-shadow-md">
            www.bestia.app
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex gap-4 flex-col sm:flex-row justify-center">
          <button
            onClick={handleScreenshot}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            📸 Captura el trofeo
          </button>
          <a
            href={`/duel/${duelId}`}
            className="px-8 py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-center"
          >
            ← Volver al duelo
          </a>
        </div>

        {/* Share Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h3 className="font-bold text-gray-900 mb-3">¿Cómo compartir tu trofeo?</h3>
          <ol className="text-sm text-gray-600 space-y-2">
            <li>1. Captura el trofeo (screenshot)</li>
            <li>2. Comparte en Instagram, WhatsApp, TikTok</li>
            <li>3. Etiqueta a otros dueños de mascotas</li>
            <li>4. ¡Invítales a competir!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
