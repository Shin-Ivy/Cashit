import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sign In — CashIt',
  description:
    'Sign in to CashIt to track your wallets, expenses, and financial goals in real time.',
};

export default function LoginPage(): React.JSX.Element {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-base">
      {/* ── Ambient glow blobs ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-mint opacity-[0.06] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-blue opacity-[0.08] blur-[120px]"
      />

      {/* ── Grid texture overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(226,232,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-md px-6 py-10">
        <div
          className="rounded-3xl border border-border bg-surface p-8 shadow-card"
          style={{ boxShadow: '0 4px 48px 0 rgba(0,0,0,0.55), 0 0 0 1px rgba(42,51,73,0.8)' }}
        >
          {/* ── Logo + Brand ── */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div
              className="relative rounded-2xl p-1"
              style={{ boxShadow: '0 0 32px 0 rgba(118,232,182,0.22)' }}
            >
              <Image
                src="/logo.png"
                alt="CashIt Logo"
                width={72}
                height={72}
                className="rounded-2xl"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-on-base">
                Cas<span className="text-mint">h</span>It
              </h1>
              <p className="mt-1 text-sm text-muted">Your money, in focus.</p>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted">
              Welcome back
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* ── Google Sign-In Button ── */}
          <button
            id="btn-google-signin"
            type="button"
            aria-label="Sign in with Google"
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3.5 text-sm font-semibold text-on-base transition-all duration-200 hover:border-mint hover:bg-surface hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98]"
            style={{ boxShadow: '0 0 0 0 rgba(118,232,182,0)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 20px 0 rgba(118,232,182,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 0 0 rgba(118,232,182,0)';
            }}
          >
            {/* Google icon SVG */}
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* ── Separator ── */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* ── Email Input ── */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="input-email"
                className="block text-xs font-medium uppercase tracking-wider text-muted"
              >
                Email
              </label>
              <input
                id="input-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-label="Email address"
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-on-base placeholder:text-muted transition-all duration-150 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-password"
                  className="block text-xs font-medium uppercase tracking-wider text-muted"
                >
                  Password
                </label>
                <button
                  id="btn-forgot-password"
                  type="button"
                  aria-label="Forgot password"
                  className="text-xs text-blue transition-colors hover:text-mint focus-visible:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="input-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-label="Password"
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-on-base placeholder:text-muted transition-all duration-150 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
              />
            </div>

            {/* ── Sign In CTA ── */}
            <button
              id="btn-email-signin"
              type="submit"
              aria-label="Sign in to CashIt"
              className="relative mt-2 w-full overflow-hidden rounded-xl px-4 py-3.5 text-sm font-bold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              style={{
                background: 'linear-gradient(135deg, #76E8B6 0%, #4B96F3 100%)',
                boxShadow: '0 0 24px 0 rgba(118,232,182,0.3)',
              }}
            >
              <span className="relative z-10">Sign In</span>
            </button>
          </div>

          {/* ── Sign Up Link ── */}
          <p className="mt-6 text-center text-xs text-muted">
            Don&apos;t have an account?{' '}
            <button
              id="btn-goto-signup"
              type="button"
              aria-label="Create a new account"
              className="font-semibold text-mint transition-colors hover:text-blue focus-visible:outline-none focus-visible:underline"
            >
              Create one free
            </button>
          </p>
        </div>

        {/* ── Footer ── */}
        <p className="mt-6 text-center text-xs text-muted">
          By signing in, you agree to our{' '}
          <button
            id="btn-terms"
            type="button"
            className="underline underline-offset-2 transition-colors hover:text-on-base focus-visible:outline-none"
          >
            Terms
          </button>{' '}
          &amp;{' '}
          <button
            id="btn-privacy"
            type="button"
            className="underline underline-offset-2 transition-colors hover:text-on-base focus-visible:outline-none"
          >
            Privacy Policy
          </button>
          .
        </p>
      </div>
    </main>
  );
}
