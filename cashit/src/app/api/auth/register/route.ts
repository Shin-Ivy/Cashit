import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

/**
 * Server-only Supabase admin client.
 * The service role key is only used inside Route Handlers — never the browser.
 */
function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
}

/**
 * POST /api/auth/register
 *
 * Accepts { email: string; password: string } and creates a new CashIt account.
 *
 * Flow:
 *  1. Validate request body shape and password length.
 *  2. Reject duplicate emails (409 Conflict) — checked against next_auth.users.
 *  3. Insert a row into next_auth.users (the trigger auto-mirrors it to public.users).
 *  4. Hash the password with bcrypt (cost factor 12) and store in user_credentials.
 *  5. Roll back user creation if the credential insert fails.
 *
 * NOTE: public.users has a FK → next_auth.users(id), so we MUST write to
 * next_auth.users first. The trigger handle_new_nextauth_user() then
 * propagates the row to public.users automatically.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // ── 1. Parse & validate body ─────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    console.error('[register] JSON parse error:', err);
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('email' in body) ||
    !('password' in body) ||
    typeof (body as Record<string, unknown>)['email'] !== 'string' ||
    typeof (body as Record<string, unknown>)['password'] !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 },
    );
  }

  const { email, password } = body as { email: string; password: string };

  const trimmedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }

  const supabase = getServiceSupabase();

  // ── 2. Duplicate email check against next_auth.users ────────────────────
  // public.users is a mirror and may lag; authoritative source is next_auth.users.
  const { data: existing, error: lookupError } = await supabase
    .schema('next_auth')
    .from('users')
    .select('id')
    .eq('email', trimmedEmail)
    .maybeSingle();

  if (lookupError !== null) {
    console.error('[register] Duplicate-check query failed:', lookupError);
    return NextResponse.json(
      { error: 'Database error. Please try again.' },
      { status: 500 },
    );
  }

  if (existing !== null) {
    return NextResponse.json(
      { error: 'An account with this email already exists.' },
      { status: 409 },
    );
  }

  // ── 3. Insert into next_auth.users first ────────────────────────────────
  // The trigger handle_new_nextauth_user() will automatically create the
  // matching row in public.users — satisfying the FK on user_credentials.
  const { data: newUser, error: insertError } = await supabase
    .schema('next_auth')
    .from('users')
    .insert({
      email: trimmedEmail,
      name: null,
      image: null,
      emailVerified: null,
    })
    .select('id')
    .single();

  if (insertError !== null || newUser === null) {
    console.error('[register] next_auth.users insert failed:', insertError);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 },
    );
  }

  // ── 4. Hash the password and persist credentials ─────────────────────────
  const passwordHash = await bcrypt.hash(password, 12);

  const { error: credError } = await supabase
    .from('user_credentials')
    .insert({ user_id: newUser.id, password_hash: passwordHash });

  if (credError !== null) {
    // ── 5. Roll back — delete the orphaned next_auth user row ────────────
    // Cascade delete on public.users is handled by the FK constraint.
    const { error: rollbackError } = await supabase
      .schema('next_auth')
      .from('users')
      .delete()
      .eq('id', newUser.id);

    if (rollbackError !== null) {
      console.error('[register] Rollback failed — orphaned user id:', newUser.id, rollbackError);
    }

    console.error('[register] user_credentials insert failed:', credError);
    return NextResponse.json(
      { error: 'Failed to save credentials. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
