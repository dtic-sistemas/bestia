import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { duelId, platform } = body;

    if (!duelId || !platform) {
      return NextResponse.json(
        { error: 'Missing duelId or platform' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('share_events')
      .insert({
        duel_id: duelId,
        platform,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Track share error:', error);
      return NextResponse.json(
        { error: 'Failed to track share' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track share error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
