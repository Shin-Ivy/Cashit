# CashIt — Personal Expense Tracker

> **Your money, in focus.**

CashIt is a dark-mode-first personal finance web application designed for students and freelancers. It enables multi-wallet management, real-time transaction tracking, and visual spending analytics — built on Next.js 15+, Supabase, and Tailwind CSS v4.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 (`strict: true`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-native `@theme`) |
| UI Primitives | [shadcn/ui](https://ui.shadcn.com/) |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Realtime) |
| State | [TanStack Query v5](https://tanstack.com/query) |
| Validation | [Zod](https://zod.dev/) |
| Auth | Google OAuth 2.0 via Supabase Auth |
| Deployment | [Vercel](https://vercel.com/) |

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (or npm ≥ 10)
- **Supabase CLI** — `npm i -g supabase`
- A Supabase project with Google OAuth configured

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/cashit.git
cd cashit
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # SERVER ONLY — never expose to client
```

> ⚠️ **`SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `NEXT_PUBLIC_`.**

### 3. Run Database Migrations

```bash
supabase db push
```

All migration files are in `supabase/migrations/` and follow the `NNN_description.sql` naming convention.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, register — unauthenticated
│   ├── dashboard/        # Protected finance dashboard
│   └── api/              # Route Handlers (server-side)
├── components/
│   ├── ui/               # shadcn/ui primitives (do not modify)
│   ├── dashboard/        # Dashboard-specific components
│   ├── transactions/     # Transaction UI components
│   ├── wallets/          # Wallet UI components
│   └── analytics/        # Charts and analytics panels
├── hooks/                # Custom React hooks (client-side only)
├── lib/
│   ├── supabase/         # Client factory functions
│   ├── schemas/          # Zod validation schemas
│   ├── formatters.ts     # formatIDR(), formatDate(), etc.
│   └── constants.ts      # App-wide constants
├── types/
│   └── database.ts       # Auto-generated Supabase types
└── middleware.ts          # Session validation (do not put auth logic in pages)

supabase/
└── migrations/           # SQL migration files (000_*.sql)

public/
└── logo.png              # Official CashIt logo — do not rename
```

---

## Design System

All brand tokens are defined in `src/app/globals.css` via Tailwind v4's `@theme` block:

| Token | Value | Usage |
|---|---|---|
| `--color-mint` | `#76E8B6` | Income, CTAs, positive states |
| `--color-blue` | `#4B96F3` | Links, secondary accents |
| `--color-base` | `#0F141E` | Page background |
| `--color-surface` | `#161C2A` | Cards, panels |
| `--color-surface-2` | `#1E2636` | Modals, dropdowns |
| `--color-border` | `#2A3349` | Dividers, outlines |
| `--color-expense` | `#F87171` | Expense indicators |

**Never hardcode hex values in JSX.** Use the token class names (`bg-mint`, `text-blue`, etc.).

---

## Development Rules

All AI agents and human contributors must follow the rules defined in [`AGENTS.md`](./AGENTS.md). Key constraints:

- **No `any`** in TypeScript — zero exceptions
- **Server Components by default** — `'use client'` only when strictly necessary
- **`<Image />`** from `next/image` — raw `<img>` tags are forbidden
- **All monetary values as integers** — `BIGINT` in DB, displayed via `formatIDR()`
- **No raw SQL** — use the Supabase typed client or RPC functions

---

## Generating Supabase Types

After any schema change, regenerate the types file:

```bash
supabase gen types typescript --local > src/types/database.ts
```

Do not manually edit `src/types/database.ts`.

---

## Deployment

Deploy to Vercel with one click or via CLI:

```bash
vercel --prod
```

Set the same environment variables from `.env.local` in your Vercel project settings. Ensure `SUPABASE_SERVICE_ROLE_KEY` is added as a **non-public** environment variable (no `NEXT_PUBLIC_` prefix).

---

## Contributing

1. Branch naming: `feat/`, `fix/`, `chore/`, `docs/`
2. Commit style: [Conventional Commits](https://www.conventionalcommits.org/)
3. All PRs must pass `npm run lint` and `npm run build` before merge

---

*CashIt — v0.1.0-alpha*
