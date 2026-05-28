"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  return (
    <main className="min-h-screen w-full bg-base flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">

      {/* ── Dot-grid texture via SVG data URI (no inline style hex) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2A3349 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Ambient glow orb ── */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-mint/5 rounded-full blur-[120px] pointer-events-none"
      />

      {/* ── Decorative feature badges (contained within viewport) ── */}
      <div
        aria-hidden="true"
        className="hidden lg:flex flex-col gap-3 absolute left-[calc(50%-380px)] top-1/2 -translate-y-1/2 pointer-events-none select-none"
      >
        <div className="bg-surface border border-border rounded-2xl px-4 py-3 shadow-card flex items-center gap-3 w-44">
          <div className="w-8 h-8 rounded-xl bg-mint/10 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-muted leading-none mb-0.5">Portfolio Value</p>
            <p className="text-sm font-bold text-mint leading-none">+18.4%</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl px-4 py-3 shadow-card flex items-center gap-3 w-44">
          <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-muted leading-none mb-0.5">Encryption</p>
            <p className="text-sm font-bold text-on-base leading-none">256-bit AES</p>
          </div>
        </div>
      </div>

      {/* ── Login Card ── */}
      <div className="w-full max-w-[400px] bg-surface/90 backdrop-blur-md border border-border rounded-3xl p-7 sm:p-9 shadow-card flex flex-col items-center relative z-10">

        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-7 w-full">
          <div className="w-14 h-14 bg-surface-2 border border-border rounded-2xl flex items-center justify-center mb-4 shadow-glow-mint">
            <Image
              src="/LoDi-Create a combination o...-May 28 2026 12-43-kczxlq3m.jpg"
              alt="CashIt Logo"
              width={44}
              height={44}
              className="rounded-xl object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-on-base tracking-tight mb-1">
            Welcome to <span className="text-mint">Cashit</span>
          </h1>
          <p className="text-xs text-muted leading-relaxed max-w-[260px]">
            Your personal <span className="text-mint">financial</span> management system
            <br />— encrypted, linked, and always in sync.
          </p>
        </div>

        {/* ── Email / Password Form ── */}
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
          className="w-full flex flex-col gap-4"
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="login-email"
              className="text-xs font-semibold text-on-base"
            >
              Email address
            </label>
            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full h-11 bg-surface-2 border border-border text-on-base rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-mint/50 focus:ring-1 focus:ring-mint/30 transition-all placeholder:text-muted box-border"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-center">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold text-on-base"
              >
                Password
              </label>
              <a
                href="#"
                className="text-[11px] text-blue hover:text-blue/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full h-11 bg-surface-2 border border-border text-on-base rounded-xl pl-10 pr-11 text-sm focus:outline-none focus:border-mint/50 focus:ring-1 focus:ring-mint/30 transition-all placeholder:text-muted box-border"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-on-base transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Keep me signed in */}
          <label
            htmlFor="keep-signed-in"
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-4 h-4 shrink-0">
              <input
                id="keep-signed-in"
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="peer w-4 h-4 appearance-none bg-surface-2 border border-border rounded checked:bg-mint checked:border-mint transition-all cursor-pointer focus:ring-1 focus:ring-mint/30 focus:outline-none"
              />
              <svg
                className="absolute inset-0 w-4 h-4 text-base pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M3.5 8l3 3 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-muted group-hover:text-on-base transition-colors select-none">
              Keep me signed in
            </span>
          </label>

          {/* Sign In Button */}
          <button
            id="btn-sign-in"
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-mint to-blue hover:opacity-90 text-base font-bold text-sm rounded-xl transition-all shadow-glow-mint active:scale-[0.98] box-border"
          >
            Sign in
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="flex items-center w-full my-5 gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted uppercase tracking-widest shrink-0">
            or link your Google account
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Google OAuth ── */}
        <button
          id="btn-google"
          type="button"
          aria-label="Continue with Google"
          className="w-full h-11 bg-surface-2 border border-border hover:border-mint/30 hover:bg-surface text-on-base font-medium text-sm rounded-xl flex items-center justify-center gap-3 transition-all box-border"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* ── Footer ── */}
        <div className="w-full text-center mt-6 flex flex-col gap-2">
          <p className="text-xs text-muted">
            New to Cashit?{" "}
            <a href="#" className="text-mint font-semibold hover:underline transition-colors">
              Create an account
            </a>
          </p>
          <p className="text-[10px] text-muted/60 flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            256-bit SSL encrypted · SOC 2 compliant
          </p>
        </div>

      </div>
    </main>
  );
}
