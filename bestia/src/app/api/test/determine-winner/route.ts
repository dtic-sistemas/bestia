import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Only available in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not available in production' },
        { status: 403 }
      );
    }

    // Find duels without winner that have expired
    const { data: duels, error } = await supabase
      .from('duels')
      .select('id, created_at, expires_at, winner_id')
      .is('winner_id', null)
      .order('expires_at', { ascending: true })
      .limit(5);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch duels' },
        { status: 500 }
      );
    }

    // Filter expired duels
    const expiredDuels = duels.filter(d => new Date(d.expires_at) < new Date());

    return NextResponse.json({
      totalDuels: duels.length,
      expiredDuels: expiredDuels.length,
      duels: expiredDuels.map(d => ({
        id: d.id,
        createdAt: d.created_at,
        expiresAt: d.expires_at,
        determineUrl: `/api/determine-winner`
      }))
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
