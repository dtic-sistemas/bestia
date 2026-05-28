import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { email } = body;

    // 2. Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // 3. Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // 4. Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12);

    // 5. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: tempPassword,
      email_confirm: true, // Auto-confirm email for MVP
    });

    if (authError || !authData?.user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // 6. Create user profile in database
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Don't fail if profile creation fails - user is already created in auth
    }

    // 7. Return success
    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      email: email.toLowerCase(),
      message: 'Account created successfully',
    });

  } catch (error) {
    console.error('Capture email error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
