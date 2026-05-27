import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { duelId, petId, deviceFingerprint } = body;

    // 2. Validate inputs
    if (!duelId || !petId) {
      return NextResponse.json(
        { error: 'Missing duelId or petId' },
        { status: 400 }
      );
    }

    // 3. Get user IP (Vercel provides this in x-forwarded-for header)
    const userIp = request.headers.get('x-forwarded-for') || 'unknown';

    // 4. Check if duel exists
    const { data: duel, error: duelError } = await supabase
      .from('duels')
      .select('id')
      .eq('id', duelId)
      .single();

    if (duelError || !duel) {
      return NextResponse.json(
        { error: 'Duel not found' },
        { status: 404 }
      );
    }

    // 5. Check if pet exists
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('id, total_votes')
      .eq('id', petId)
      .single();

    if (petError || !pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    // 6. Insert vote (will fail if duplicate due to UNIQUE constraint)
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        duel_id: duelId,
        pet_id: petId,
        user_ip: userIp,
        device_fingerprint: deviceFingerprint || null,
      })
      .select()
      .single();

    // 7. Handle database errors
    if (voteError) {
      // UNIQUE constraint violation = duplicate vote (error code 23505)
      if (voteError.code === '23505') {
        return NextResponse.json(
          { error: 'Ya votaste en este duelo' },
          { status: 400 }
        );
      }
      console.error('Vote insert error:', voteError);
      throw voteError;
    }

    // 8. Update pet vote count
    const { error: updateError } = await supabase
      .from('pets')
      .update({ total_votes: (pet.total_votes || 0) + 1 })
      .eq('id', petId);

    if (updateError) {
      console.error('Vote count update error:', updateError);
    }

    // 9. Return success
    return NextResponse.json({
      success: true,
      vote: vote,
      message: 'Vote counted',
    });

  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
