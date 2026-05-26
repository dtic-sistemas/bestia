import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { status: 'error', db: 'disconnected', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
