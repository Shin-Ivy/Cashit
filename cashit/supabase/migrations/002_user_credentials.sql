-- ──────────────────────────────────────────────────────────────────────────
--  Migration 002 — user_credentials
--
--  Stores bcrypt password hashes for Email/Password sign-in.
--  Kept in a dedicated table so:
--    • OAuth-only accounts naturally have no entry here.
--    • The NextAuth adapter schema (users, accounts, sessions) stays untouched.
--    • RLS ensures only the service role (server-side) can read or write hashes.
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_credentials (
  user_id       UUID        NOT NULL
                            REFERENCES public.users (id) ON DELETE CASCADE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id)
);

-- ── Trigger: keep updated_at current on every row update ─────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_user_credentials_updated_at
  BEFORE UPDATE ON public.user_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────
-- Password hashes must NEVER be accessible from the browser client.
-- All reads/writes happen through the service role key inside Route Handlers.

ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

-- Deny all access from anon and authenticated JWT roles.
-- The service role bypasses RLS entirely — no additional policy needed.
CREATE POLICY "deny_all_non_service"
  ON public.user_credentials
  AS RESTRICTIVE
  USING (false)
  WITH CHECK (false);
