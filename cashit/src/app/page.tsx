"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, LogIn, Shield, Zap, PieChart } from "lucide-react";
import DashboardPreview from "@/components/dashboard/DashboardPreview";

export default function LandingPage(): React.JSX.Element {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  function handleModeToggle(): void {
    setIsSignUp((v) => !v);
    setErrorMsg(null);
    setPassword("");
  }

  async function handleGoogleSignIn(): Promise<void> {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setErrorMsg(data.error ?? "Registration failed.");
          return;
        }
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });
        if (result?.error) {
          setErrorMsg("Account created! Please sign in below.");
          setIsSignUp(false);
        } else {
          router.replace("/dashboard");
        }
      } else {
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });
        if (result?.error) {
          setErrorMsg("Invalid email or password.");
        } else {
          router.replace("/dashboard");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Auth form overlay ─────────────────────────────────────────────────── */
  if (showAuth) {
    return (
      <main className="min-h-screen w-full bg-base flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
        <div aria-hidden="true" className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #2A3349 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div aria-hidden="true" className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-mint/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[400px] bg-surface/90 backdrop-blur-md border border-border rounded-3xl p-7 sm:p-9 shadow-card flex flex-col items-center relative z-10">
          <div className="flex flex-col items-center text-center mb-7 w-full">
            <div className="w-14 h-14 bg-surface-2 border border-border rounded-2xl flex items-center justify-center mb-4 shadow-glow-mint">
              <Image src="/logo.png" alt="CashIt Logo" width={44} height={44} className="rounded-xl object-cover" priority />
            </div>
            <h1 className="text-2xl font-bold text-on-base tracking-tight mb-1">
              {isSignUp ? (<>Create your <span className="text-mint">CashIt</span> account</>) : (<>Welcome to <span className="text-mint">CashIt</span></>)}
            </h1>
            <p className="text-xs text-muted leading-relaxed max-w-[260px]">
              {isSignUp ? "Join thousands tracking their finances with clarity." : <>Your personal <span className="text-mint">financial</span> management system<br />— encrypted, linked, and always in sync.</>}
            </p>
          </div>

          {errorMsg !== null && (
            <div role="alert" className="w-full mb-4 px-4 py-3 rounded-xl bg-expense/10 border border-expense/30 text-expense text-xs font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="login-email" className="text-xs font-semibold text-on-base">Email address</label>
              <div className="relative w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }} className="w-full h-11 bg-surface-2 border border-border text-on-base rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-mint/50 focus:ring-1 focus:ring-mint/30 transition-all placeholder:text-muted box-border" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-xs font-semibold text-on-base">Password</label>
                {!isSignUp && <a href="#" className="text-[11px] text-blue hover:text-blue/80 transition-colors">Forgot password?</a>}
              </div>
              <div className="relative w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input id="login-password" type={showPassword ? "text" : "password"} placeholder={isSignUp ? "Min. 8 characters" : "••••••••"} autoComplete={isSignUp ? "new-password" : "current-password"} required value={password} onChange={(e) => { setPassword(e.target.value); setErrorMsg(null); }} className="w-full h-11 bg-surface-2 border border-border text-on-base rounded-xl pl-10 pr-11 text-sm focus:outline-none focus:border-mint/50 focus:ring-1 focus:ring-mint/30 transition-all placeholder:text-muted box-border" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-on-base transition-colors">
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <label htmlFor="keep-signed-in" className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative w-4 h-4 shrink-0">
                  <input id="keep-signed-in" type="checkbox" checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)} className="peer w-4 h-4 appearance-none bg-surface-2 border border-border rounded checked:bg-mint checked:border-mint transition-all cursor-pointer focus:ring-1 focus:ring-mint/30 focus:outline-none" />
                  <svg className="absolute inset-0 w-4 h-4 text-base pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 16 16" fill="none"><path d="M3.5 8l3 3 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span className="text-xs text-muted group-hover:text-on-base transition-colors select-none">Keep me signed in</span>
              </label>
            )}

            <button id={isSignUp ? "btn-sign-up" : "btn-sign-in"} type="submit" disabled={isLoading} className="w-full h-11 bg-gradient-to-r from-mint to-blue hover:opacity-90 text-base font-bold text-sm rounded-xl transition-all shadow-glow-mint active:scale-[0.98] box-border disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <><svg className="w-4 h-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>{isSignUp ? "Creating account…" : "Signing in…"}</>
              ) : (isSignUp ? "Sign Up" : "Sign in")}
            </button>
          </form>

          <div className="flex items-center w-full my-5 gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted uppercase tracking-widest shrink-0">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button id="btn-google" type="button" aria-label="Continue with Google" disabled={isGoogleLoading || status === "loading"} onClick={handleGoogleSignIn} className="w-full h-11 bg-surface-2 border border-border hover:border-mint/30 hover:bg-surface text-on-base font-medium text-sm rounded-xl flex items-center justify-center gap-3 transition-all box-border disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {isGoogleLoading ? (
              <svg className="w-4 h-4 shrink-0 animate-spin text-mint" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            )}
            {isGoogleLoading ? "Redirecting to Google…" : "Continue with Google"}
          </button>

          <div className="w-full text-center mt-6 flex flex-col gap-2">
            <p className="text-xs text-muted">
              {isSignUp ? "Already have an account?" : "New to CashIt?"}{" "}
              <button type="button" onClick={handleModeToggle} className="text-mint font-semibold hover:underline transition-colors bg-transparent border-none cursor-pointer p-0">
                {isSignUp ? "Sign in" : "Create an account"}
              </button>
            </p>
            <button type="button" onClick={() => setShowAuth(false)} className="text-[11px] text-blue hover:underline bg-transparent border-none cursor-pointer p-0">
              ← Back to preview
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ── Public Preview Landing ────────────────────────────────────────────── */
  return (
    <main className="min-h-screen w-full bg-base relative overflow-hidden">
      {/* Dot-grid background */}
      <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #2A3349 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* ── Preview Banner ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 w-full">
        <div className="bg-surface-2/90 backdrop-blur-xl border-b border-border">
          <div className="max-w-lg lg:max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-expense/10 flex items-center justify-center shrink-0 lg:hidden">
                <AlertTriangle className="w-4 h-4 text-expense" />
              </div>
              {/* Desktop: Logo + branding in banner */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-8 h-8 bg-surface border border-border rounded-xl flex items-center justify-center shadow-glow-mint">
                  <Image src="/logo.png" alt="CashIt Logo" width={24} height={24} className="rounded-lg object-cover" priority />
                </div>
                <span className="text-base font-bold text-on-base tracking-tight">
                  Cash<span className="text-mint">It</span>
                </span>
              </div>
              <p className="text-xs text-on-base font-medium truncate lg:hidden">
                <span className="text-expense font-semibold">Preview Mode</span>
                <span className="text-muted"> — No active account linked.</span>
              </p>
              {/* Desktop: navigation-style links */}
              <div className="hidden lg:flex items-center gap-6 ml-8">
                <span className="text-sm text-muted hover:text-on-base transition-colors cursor-pointer">Features</span>
                <span className="text-sm text-muted hover:text-on-base transition-colors cursor-pointer">Security</span>
                <span className="text-sm text-muted hover:text-on-base transition-colors cursor-pointer">Open Finance</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="shrink-0 h-8 lg:h-10 px-4 lg:px-6 bg-gradient-to-r from-mint to-blue text-base font-bold text-xs lg:text-sm rounded-lg lg:rounded-xl flex items-center gap-1.5 lg:gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-glow-mint"
            >
              <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT: Vertical hero → blurred preview (unchanged)
          DESKTOP LAYOUT: 2-column split — Hero Left | Preview Right
          ════════════════════════════════════════════════════════════════════ */}

      {/* ── Mobile Hero (hidden on desktop) ────────────────────────────── */}
      <div className="lg:hidden relative z-10 max-w-lg mx-auto px-4 pt-8 pb-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-surface-2 border border-border rounded-2xl flex items-center justify-center mb-4 shadow-glow-mint">
          <Image src="/logo.png" alt="CashIt Logo" width={52} height={52} className="rounded-xl object-cover" priority />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-base tracking-tight mb-2">
          Your Money, <span className="text-mint">In Focus</span>
        </h1>
        <p className="text-sm text-muted max-w-xs mb-6">
          Track wallets, monitor spending, and link e-wallets — all in one sleek dashboard.
        </p>
        <button
          type="button"
          onClick={() => setShowAuth(true)}
          className="h-11 px-8 bg-gradient-to-r from-mint to-blue text-base font-bold text-sm rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-glow-mint mb-8"
        >
          <LogIn className="w-4 h-4" />
          Link Account / Sign In
        </button>
      </div>

      {/* ── Mobile Blurred Preview (hidden on desktop) ─────────────────── */}
      <div className="lg:hidden relative z-0">
        <div className="pointer-events-none select-none" style={{ filter: "blur(3px)", opacity: 0.7 }}>
          <DashboardPreview />
        </div>
        {/* Gradient fade at bottom */}
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-base to-transparent" />
      </div>

      {/* ── Desktop 2-Column Layout (hidden on mobile) ─────────────────── */}
      <div className="hidden lg:block relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 gap-12 items-start">

            {/* Left Column: Hero Content */}
            <div className="flex flex-col justify-center py-8 sticky top-32">
              <div className="w-20 h-20 bg-surface-2 border border-border rounded-3xl flex items-center justify-center mb-8 shadow-glow-mint">
                <Image src="/logo.png" alt="CashIt Logo" width={60} height={60} className="rounded-2xl object-cover" priority />
              </div>

              <h1 className="text-5xl xl:text-6xl font-bold text-on-base tracking-tight mb-4 leading-tight">
                Your Money,<br />
                <span className="bg-gradient-to-r from-mint to-blue bg-clip-text text-transparent">In Focus</span>
              </h1>

              <p className="text-lg text-muted max-w-md mb-8 leading-relaxed">
                Track wallets, monitor spending patterns, and link e-wallets — all in one sleek, real-time dashboard designed for clarity.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-col gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mint/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-base">Bank-Grade Security</p>
                    <p className="text-xs text-muted">End-to-end encryption for all financial data</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-base">Real-Time Sync</p>
                    <p className="text-xs text-muted">Instant balance updates across all linked wallets</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mint/10 flex items-center justify-center shrink-0">
                    <PieChart className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-base">Smart Analytics</p>
                    <p className="text-xs text-muted">AI-powered spending insights and category breakdowns</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  className="h-12 px-8 bg-gradient-to-r from-mint to-blue text-base font-bold text-sm rounded-xl flex items-center gap-2.5 hover:opacity-90 active:scale-[0.97] transition-all shadow-glow-mint"
                >
                  <LogIn className="w-4.5 h-4.5" />
                  Get Started Free
                </button>
                <span className="text-xs text-muted">No credit card required</span>
              </div>
            </div>

            {/* Right Column: Dashboard Preview (un-blurred, full detail) */}
            <div className="relative">
              {/* Decorative glow orbs */}
              <div aria-hidden="true" className="absolute -top-8 -right-8 w-64 h-64 bg-mint/5 rounded-full blur-[100px] pointer-events-none" />
              <div aria-hidden="true" className="absolute -bottom-8 -left-8 w-48 h-48 bg-blue/5 rounded-full blur-[80px] pointer-events-none" />

              {/* Preview container with subtle border glow */}
              <div className="relative bg-surface/30 border border-border/50 rounded-3xl p-6 backdrop-blur-sm shadow-card">
                <div className="pointer-events-none select-none">
                  <DashboardPreview />
                </div>
                {/* Bottom gradient fade */}
                <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base/80 to-transparent rounded-b-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop bottom trust bar */}
        <div className="border-t border-border/30 bg-surface/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-center gap-12">
            <div className="flex items-center gap-2 text-muted">
              <Shield className="w-4 h-4 text-mint/60" />
              <span className="text-xs">256-bit AES Encryption</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted">
              <Zap className="w-4 h-4 text-blue/60" />
              <span className="text-xs">Open Finance Ready</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted">
              <PieChart className="w-4 h-4 text-mint/60" />
              <span className="text-xs">GoPay • OVO • DANA</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
