import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sign In — CashIt',
  description:
    'Sign in to CashIt to track your wallets, expenses, and financial goals in real time.',
};

export default function LoginPage(): React.JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-base relative overflow-hidden">

      {/* ── Ambient glow blobs ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-mint opacity-[0.07] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[460px] w-[460px] rounded-full bg-blue opacity-[0.09] blur-[120px]"
      />

      {/* ── Subtle grid texture overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(226,232,240,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Card Container ── */}
      <div className="relative z-10 w-full max-w-[440px] p-8 sm:p-12 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

        {/* ── Logo + Brand ── */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative rounded-2xl p-1 flex-shrink-0"
            style={{ boxShadow: '0 0 40px 0 rgba(118,232,182,0.25)' }}
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
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-on-base">
              Cas<span className="text-mint">h</span>It
            </h1>
            <p className="text-sm text-muted">Your money, in focus.</p>
          </div>
        </div>

        {/* ── Welcome divider ── */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
            Welcome back
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ── Auth Section ── */}
        <div className="mt-6 space-y-6">

          {/* Google Sign-In Button */}
          <button
            id="btn-google-signin"
            type="button"
            aria-label="Sign in with Google"
            className="group flex w-full items-center justify-center gap-3 h-14 px-5 rounded-xl border border-border bg-surface-2 text-sm font-semibold text-on-base transition-all duration-200 hover:border-mint hover:bg-surface hover:text-mint hover:shadow-[0_0_24px_0_rgba(118,232,182,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98]"
          >
            {/* Google icon */}
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
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

          {/* Or separator */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email & Password Form */}
          <div className="space-y-4">

            {/* Email field */}
            <div className="space-y-2">
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
                className="w-full h-14 px-5 rounded-xl border border-border bg-surface-2 text-sm text-on-base placeholder:text-muted transition-all duration-150 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
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
                  className="text-xs text-blue transition-colors hover:text-mint focus-visible:outline-none focus-visible:underline flex-shrink-0"
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
                className="w-full h-14 px-5 rounded-xl border border-border bg-surface-2 text-sm text-on-base placeholder:text-muted transition-all duration-150 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
              />
            </div>

            {/* Sign In CTA */}
            <button
              id="btn-email-signin"
              type="submit"
              aria-label="Sign in to CashIt"
              className="relative w-full h-14 px-5 overflow-hidden rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              style={{
                background: 'linear-gradient(135deg, #76E8B6 0%, #4B96F3 100%)',
                boxShadow: '0 0 28px 0 rgba(118,232,182,0.35)',
                color: '#0F141E',
              }}
            >
              Sign In
            </button>
          </div>

          {/* Sign Up link */}
          <p className="text-center text-xs text-muted">
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
        <p className="mt-8 text-center text-xs text-muted leading-relaxed">
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
