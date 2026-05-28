import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { duelId } = body;

    if (!duelId) {
      return NextResponse.json(
        { error: 'Missing duelId' },
        { status: 400 }
      );
    }

    // Get duel
    const { data: duel, error: duelError } = await supabase
      .from('duels')
      .select('*')
      .eq('id', duelId)
      .single();

    if (duelError || !duel) {
      return NextResponse.json(
        { error: 'Duel not found' },
        { status: 404 }
      );
    }

    // Check if duel is already resolved
    if (duel.winner_id) {
      return NextResponse.json(
        { error: 'Duel already has a winner' },
        { status: 400 }
      );
    }

    // Check if 24h have passed
    const expiresAt = new Date(duel.expires_at);
    const now = new Date();
    if (now < expiresAt) {
      return NextResponse.json(
        { error: 'Duel has not expired yet' },
        { status: 400 }
      );
    }

    // Count votes for each pet
    const { count: votes1 } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('duel_id', duelId)
      .eq('pet_id', duel.pet1_id);

    const { count: votes2 } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('duel_id', duelId)
      .eq('pet_id', duel.pet2_id);

    const count1 = votes1 || 0;
    const count2 = votes2 || 0;

    // Determine winner (most votes, ties = pet1 wins)
    const winnerId = count1 >= count2 ? duel.pet1_id : duel.pet2_id;
    const loserId = winnerId === duel.pet1_id ? duel.pet2_id : duel.pet1_id;

    // Update duel with winner
    const { error: updateError } = await supabase
      .from('duels')
      .update({
        winner_id: winnerId,
        result_displayed_at: new Date().toISOString()
      })
      .eq('id', duelId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update duel' },
        { status: 500 }
      );
    }

    // Update pet stats
    const { data: winnerPet } = await supabase
      .from('pets')
      .select('wins')
      .eq('id', winnerId)
      .single();

    const { data: loserPet } = await supabase
      .from('pets')
      .select('losses')
      .eq('id', loserId)
      .single();

    await supabase
      .from('pets')
      .update({ wins: (winnerPet?.wins || 0) + 1 })
      .eq('id', winnerId);

    await supabase
      .from('pets')
      .update({ losses: (loserPet?.losses || 0) + 1 })
      .eq('id', loserId);

    return NextResponse.json({
      success: true,
      data: {
        duelId,
        winnerId,
        loserId,
        winnerVotes: Math.max(count1, count2),
        loserVotes: Math.min(count1, count2)
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
