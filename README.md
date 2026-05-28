<div align="center">

# 💸 CashIt

**Real-time personal expense tracking — dark, minimal, and built for speed.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## What is CashIt?

**CashIt** is a modern, web-based personal expense tracker built for students, freelancers, and young professionals who manage money across multiple wallets — physical cash, GoPay, DANA, bank transfers, and more.

It delivers a **zero-friction, real-time financial clarity experience** through:

- 🔐 **One-click login** via Google OAuth 2.0 — no passwords, no friction
- 👛 **Multi-wallet architecture** — track distinct balance pools independently
- ⚡ **Real-time dashboard** — transactions update the UI in under 500ms via Supabase Realtime
- 📊 **Visual analytics** — category-based donut charts with a dark-mode-first palette
- 🌑 **Premium dark UI** — mint green (`#76E8B6`) and bright blue (`#4B96F3`) on a deep dark base (`#0F141E`)

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 15 App Router](https://nextjs.org/docs/app) | Full-stack React with RSC, Edge Middleware, Route Handlers |
| **Language** | [TypeScript (strict)](https://www.typescriptlang.org/) | End-to-end type safety, zero `any` policy |
| **Auth & DB** | [Supabase](https://supabase.com/) | PostgreSQL, Google OAuth, RLS, Realtime WebSockets |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Design system, dark-mode-first components |
| **Client State** | [TanStack Query v5](https://tanstack.com/query/latest) | Optimistic updates, cache management, server-state sync |
| **Validation** | [Zod](https://zod.dev/) | Runtime schema validation for all user inputs |
| **Charts** | [Recharts](https://recharts.org/) | Responsive, React-native donut/bar charts |
| **Deployment** | [Vercel](https://vercel.com/) | Edge Network, preview deployments, CI/CD integration |

---

## Project Structure

```
cashit/
├── app/
│   ├── layout.tsx              # Root layout (fonts, providers)
│   ├── page.tsx                # Landing / Login page
│   ├── auth/callback/route.ts  # Google OAuth callback handler
│   ├── dashboard/              # Protected dashboard pages
│   └── api/                    # Route Handlers (wallets, transactions, analytics)
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── dashboard/              # Dashboard-specific components
│   ├── transactions/           # Transaction form, list, category picker
│   ├── wallets/                # Wallet cards and management modal
│   └── analytics/              # Chart components and period filter
├── hooks/                      # Custom React hooks (useWallets, useTransactions…)
├── lib/
│   ├── supabase/               # Server and browser client factories
│   ├── schemas/                # Zod validation schemas
│   ├── formatters.ts           # formatIDR(), formatDate()
│   └── constants.ts            # Brand colours, category definitions
├── types/database.ts           # Auto-generated Supabase types
├── supabase/migrations/        # Ordered SQL migration files
├── middleware.ts               # Edge session guard
└── public/                     # Static assets (logo)
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) >= 20.x
- [pnpm](https://pnpm.io/) >= 9.x (`npm install -g pnpm`)
- A [Supabase](https://supabase.com/) project (free tier is sufficient for local dev)
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/cashit.git
cd cashit/cashit
```

---

### Step 2 — Configure Environment Variables

Create a `.env.local` file in the `cashit/` directory (next to `package.json`). This file is git-ignored and must never be committed.

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```env
# ─── Supabase ─────────────────────────────────────────────────────────────────
# Found in: Supabase Dashboard → Project Settings → API

# Your Supabase project REST URL
# Example: https://xyzabcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co

# Your public anon key (safe to expose; RLS enforced at DB level)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Your service role key — SERVER ONLY, never prefix with NEXT_PUBLIC_
# Used exclusively for the /api/user/delete route handler
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **⚠️ Security Warning**: `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row Level Security policies. It must **never** be used in Client Components or prefixed with `NEXT_PUBLIC_`. Only Route Handlers on the server may access it.

**Where to find these values:**

1. Open [supabase.com](https://supabase.com/) and sign in.
2. Navigate to your project → **Project Settings** → **API**.
3. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **`anon` / `public` key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the **`service_role` key** → `SUPABASE_SERVICE_ROLE_KEY`

---

### Step 3 — Configure Google OAuth in Supabase

1. In your Supabase project, go to **Authentication** → **Providers** → **Google**.
2. Enable the Google provider.
3. In [Google Cloud Console](https://console.cloud.google.com/), create OAuth 2.0 credentials:
   - **Authorized redirect URI**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Paste the **Client ID** and **Client Secret** into Supabase's Google provider settings.
5. Save.

For local development, also add `http://localhost:3000/auth/callback` to your Google OAuth authorized redirect URIs.

---

### Step 4 — Apply Database Migrations

Run migrations against your Supabase project using the Supabase CLI:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your remote Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations in supabase/migrations/
supabase db push
```

Migrations are applied in order and create:
- `users`, `wallets`, `categories`, `transactions` tables
- Row Level Security (RLS) policies on all tables
- Postgres RPC functions for balance and analytics computation
- Realtime publication configuration for live UI updates

---

### Step 5 — Install Dependencies

```bash
pnpm install
```

---

### Step 6 — Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The development server starts with:
- **Hot module replacement** (HMR) for instant UI updates
- **TypeScript strict mode** — type errors surface immediately in the terminal
- **Turbopack** (via Next.js 15 default) for fast cold starts

---

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start local development server (Turbopack) |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server locally |
| `pnpm lint` | Run ESLint with zero-warnings policy |
| `pnpm typecheck` | Run `tsc --noEmit` for type validation |
| `pnpm test` | Run unit tests with Vitest |

---

## Environment Variables Reference

| Variable | Required | Scope | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Client + Server | Supabase project REST URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Client + Server | Public anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server only** | Admin key — account deletion route only |

---

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/cashit)

### Manual Deployment

1. Push your repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Set the **Root Directory** to `cashit/` (the Next.js app folder).
4. Add all three environment variables from Step 2 in **Vercel → Project Settings → Environment Variables**.
5. Deploy.

> After deploying, add your Vercel production URL (e.g., `https://cashit.vercel.app/auth/callback`) to both your Google OAuth **Authorized redirect URIs** and your Supabase **URL Configuration** (Auth → URL Configuration → Redirect URLs).

---

## Key Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Rendering | **React Server Components by default** | Minimal client JS; data fetched server-side for fast LCP |
| Auth tokens | **HttpOnly cookies via `@supabase/ssr`** | Eliminates XSS token theft risk; no `localStorage` |
| Monetary storage | **BIGINT (whole IDR units)** | Eliminates IEEE 754 floating-point rounding errors |
| Client state | **TanStack Query with optimistic updates** | Instant UI feedback; automatic rollback on failure |
| Real-time sync | **Supabase Realtime → cache invalidation** | UI always shows server-authoritative state |
| Security | **Supabase RLS on every table** | Database-level user isolation; no app-level trust |

For the full architecture rationale, see [`SAD.md`](./SAD.md).

---

## Documentation Index

| Document | Description |
|---|---|
| [`BRD.md`](./BRD.md) | Business Requirements Document — market context, objectives, KPIs |
| [`PRD.md`](./PRD.md) | Product Requirements Document — feature specifications, user flows |
| [`SRS.md`](./SRS.md) | Software Requirements Specification — functional and non-functional requirements |
| [`FSD.md`](./FSD.md) | Functional Specification Document — detailed UI/UX and feature behaviour |
| [`SAD.md`](./SAD.md) | Software Architecture Document — system design, DB schema, ADRs |
| [`Agents.md`](./Agents.md) | AI Code Generation Rules — TypeScript, Tailwind, Supabase, and security standards |

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feat/your-feature`
2. Follow all rules in [`Agents.md`](./Agents.md) — zero `any`, Server Components by default, brand colours only.
3. Ensure all checks pass before opening a PR:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test
   ```
4. Open a Pull Request against `main`. Vercel will automatically create a preview deployment.

---

## License

[MIT](LICENSE) © 2026 CashIt Team

---

<div align="center">
  <sub>Built with 💚 using Next.js, Supabase, and Tailwind CSS</sub>
</div>
