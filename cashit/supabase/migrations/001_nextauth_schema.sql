-- ============================================================
--  CashIt — Migration 001: NextAuth + Supabase Adapter Schema
--  Run this once in: Supabase Dashboard → SQL Editor
-- ============================================================
--
--  @auth/supabase-adapter writes auth data to a SEPARATE `next_auth`
--  schema, NOT to Supabase's built-in `auth` schema. This keeps
--  NextAuth sessions isolated from Supabase Auth internals.
--
--  After running this script you MUST also:
--  1. Go to Supabase Dashboard → Project Settings → API
--  2. Add "next_auth" to the "Exposed schemas" list and save.
-- ============================================================

-- ── Create the next_auth schema ──────────────────────────────
CREATE SCHEMA IF NOT EXISTS next_auth;

GRANT USAGE  ON SCHEMA next_auth TO service_role;
GRANT ALL    ON SCHEMA next_auth TO postgres;

-- ── Users table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS next_auth.users (
  id             uuid         NOT NULL DEFAULT uuid_generate_v4(),
  name           text,
  email          text,
  "emailVerified" timestamp with time zone,
  image          text,
  CONSTRAINT users_pkey        PRIMARY KEY (id),
  CONSTRAINT email_unique      UNIQUE (email)
);

GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;

-- ── uid() helper for Row Level Security policies ──────────────
--    Returns the UUID of the currently authenticated NextAuth user.
CREATE OR REPLACE FUNCTION next_auth.uid()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

-- ── Sessions table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id              uuid         NOT NULL DEFAULT uuid_generate_v4(),
  expires         timestamp with time zone NOT NULL,
  "sessionToken"  text         NOT NULL,
  "userId"        uuid,
  CONSTRAINT sessions_pkey          PRIMARY KEY (id),
  CONSTRAINT sessionToken_unique    UNIQUE ("sessionToken"),
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES next_auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;

-- ── Accounts table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id                   uuid  NOT NULL DEFAULT uuid_generate_v4(),
  type                 text  NOT NULL,
  provider             text  NOT NULL,
  "providerAccountId"  text  NOT NULL,
  refresh_token        text,
  access_token         text,
  expires_at           bigint,
  token_type           text,
  scope                text,
  id_token             text,
  session_state        text,
  oauth_token_secret   text,
  oauth_token          text,
  "userId"             uuid,
  CONSTRAINT accounts_pkey          PRIMARY KEY (id),
  CONSTRAINT provider_unique        UNIQUE (provider, "providerAccountId"),
  CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES next_auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;

-- ── Verification tokens table ────────────────────────────────
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier  text,
  token       text,
  expires     timestamp with time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey     PRIMARY KEY (token),
  CONSTRAINT token_unique                 UNIQUE (token),
  CONSTRAINT token_identifier_unique      UNIQUE (token, identifier)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;

-- ============================================================
--  PUBLIC SCHEMA: Mirror user rows for application queries
--
--  The public.users table stores the subset of user data that
--  the CashIt application reads. A trigger keeps it in sync
--  automatically whenever a new Google sign-in creates a row
--  in next_auth.users.
-- ============================================================

-- Ensure public.users exists with the correct columns.
-- (If it already exists from a prior migration this is a no-op.)
CREATE TABLE IF NOT EXISTS public.users (
  -- UUID mirrors next_auth.users.id exactly
  id     uuid NOT NULL,
  name   text,
  email  text,
  image  text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT "users_id_fkey" FOREIGN KEY (id)
    REFERENCES next_auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Enable Row Level Security so users can only see their own row.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow each user to read their own data.
DROP POLICY IF EXISTS "Can view own user data." ON public.users;
CREATE POLICY "Can view own user data."
  ON public.users FOR SELECT
  USING (next_auth.uid() = id);

-- Allow each user to update their own data.
DROP POLICY IF EXISTS "Can update own user data." ON public.users;
CREATE POLICY "Can update own user data."
  ON public.users FOR UPDATE
  USING (next_auth.uid() = id);

-- ── Trigger: auto-create public.users row on first Google sign-in ──
CREATE OR REPLACE FUNCTION public.handle_new_nextauth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, image)
  VALUES (NEW.id, NEW.name, NEW.email, NEW.image)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_nextauth_user_created ON next_auth.users;
CREATE TRIGGER on_nextauth_user_created
  AFTER INSERT ON next_auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_nextauth_user();