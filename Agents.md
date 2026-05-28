# Agents.md — AI Code Generation System Instructions
## CashIt — Personal Expense Tracker Web Application

> **Scope**: This document is the authoritative system instruction manual for all AI coding agents (GitHub Copilot, Cursor, Gemini, Claude, etc.) operating within this repository. Every code generation action must comply with these rules without exception.

---

## Table of Contents

1. [Prime Directives](#1-prime-directives)
2. [TypeScript Enforcement](#2-typescript-enforcement)
3. [Next.js App Router Conventions](#3-nextjs-app-router-conventions)
4. [Styling System — Tailwind CSS + shadcn/ui](#4-styling-system--tailwind-css--shadcnui)
5. [Brand Colour System](#5-brand-colour-system)
6. [Logo & Image Handling](#6-logo--image-handling)
7. [Supabase Integration Rules](#7-supabase-integration-rules)
8. [Data & State Management Rules](#8-data--state-management-rules)
9. [Security Non-Negotiables](#9-security-non-negotiables)
10. [File & Folder Conventions](#10-file--folder-conventions)
11. [Naming Conventions](#11-naming-conventions)
12. [Prohibited Patterns](#12-prohibited-patterns)
13. [Component Generation Checklist](#13-component-generation-checklist)

---

## 1. Prime Directives

These rules have **absolute priority**. Violating any of them is a hard failure, not a suggestion.

| # | Directive |
|---|---|
| PD-01 | **Never use `any`** in TypeScript. There are no valid exceptions. |
| PD-02 | **Server Components by default.** Add `'use client'` only when strictly necessary (event handlers, hooks, browser APIs). |
| PD-03 | **Dark mode is not optional.** Every UI component must render correctly against the dark base palette (`#0F141E`). |
| PD-04 | **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.** This key must only appear in Server Components and Route Handlers. |
| PD-05 | **Never store monetary values as `number` or `float`.** All amounts are `BIGINT` in the database and `bigint` or `number` (integer-safe) on the display layer. |
| PD-06 | **Always use the Next.js `<Image />` component** for all `<img>` tags. Raw `<img>` elements are forbidden. |
| PD-07 | **Never write raw SQL in application code.** Use the Supabase typed client or RPC functions defined in `lib/supabase/`. |

---

## 2. TypeScript Enforcement

### 2.1 Compiler Configuration

The project runs TypeScript with `strict: true`. The AI must generate code compatible with this configuration at all times.

```json
// tsconfig.json — enforced settings (do not relax)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2.2 Type Rules

| Rule | ✅ Correct | ❌ Forbidden |
|---|---|---|
| No implicit `any` | `(id: string)` | `(id)` |
| No explicit `any` | `unknown` then narrow | `any` |
| Return types on functions | `function foo(): string` | `function foo()` |
| API response types | `Database['public']['Tables']['wallets']['Row']` | `any` / `object` |
| Union types over loose strings | `'income' \| 'expense'` | `string` |
| Optional props | `label?: string` | `label: string \| undefined` (inconsistent) |

### 2.3 Database Types

All Supabase table types are imported from `@/types/database.ts` (generated via `supabase gen types typescript`). The AI must **never** manually define types that shadow or duplicate database types.

```typescript
// ✅ Correct: use generated database types
import type { Database } from '@/types/database';

type Wallet = Database['public']['Tables']['wallets']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
```

### 2.4 Zod Schemas

All user-submitted data must be validated with a Zod schema defined in `lib/schemas/` before any Supabase operation.

```typescript
// ✅ Correct: validate before insert
import { transactionInsertSchema } from '@/lib/schemas/transaction';

const parsed = transactionInsertSchema.safeParse(formData);
if (!parsed.success) {
  return { error: parsed.error.flatten() };
}
```

---

## 3. Next.js App Router Conventions

### 3.1 Component Default: Server Component

Every new component file is a **React Server Component (RSC)** by default. The AI must not add `'use client'` unless the component uses one of:

- `useState`, `useEffect`, `useReducer`, or any React hook
- Browser APIs (`window`, `document`, `navigator`)
- Event handlers passed directly as props (`onClick`, `onSubmit`, etc.)
- Third-party libraries that are client-only (e.g., Recharts, Sonner toaster)
- TanStack Query hooks (`useQuery`, `useMutation`)

### 3.2 Data Fetching in Server Components

```typescript
// ✅ Correct: fetch directly in RSC using server Supabase client
import { createServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: wallets } = await supabase.from('wallets').select('*');
  // Pass data to Client Components as props
  return <DashboardClient wallets={wallets ?? []} />;
}
```

### 3.3 Route Handler Structure

```typescript
// ✅ Correct: app/api/wallets/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(): Promise<NextResponse> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from('wallets').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
```

### 3.4 Metadata

Every `page.tsx` must export a `metadata` or `generateMetadata` export.

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — CashIt',
  description: 'Track your wallets and spending in real time.',
};
```

### 3.5 Middleware

Session validation is handled in `middleware.ts`. The AI must never re-implement auth guard logic inside individual page components — rely on middleware.

---

## 4. Styling System — Tailwind CSS + shadcn/ui

### 4.1 Tailwind as the Single Source of Styling Truth

- **No inline `style` props** unless absolutely required for dynamic CSS custom properties.
- **No CSS Modules** — all styles via Tailwind utility classes.
- **No external UI libraries** other than `shadcn/ui`. Do not introduce MUI, Chakra, Ant Design, etc.

### 4.2 `tailwind.config.ts` — Mandatory Extensions

The AI must always extend the Tailwind config with the CashIt brand tokens. The following block in `tailwind.config.ts` is **canonical** and must not be removed or modified:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // dark mode driven by class strategy
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── CashIt Brand Palette ──────────────────────────────────────
        'mint':      '#76E8B6', // Primary accent — income, positive states
        'blue':      '#4B96F3', // Secondary accent — CTAs, links, info states
        'base':      '#0F141E', // Dark base background (deepest layer)
        'surface':   '#161C2A', // Card / panel surface
        'surface-2': '#1E2636', // Elevated surface (modals, dropdowns)
        'border':    '#2A3349', // Subtle border colour
        'muted':     '#64748B', // De-emphasised text, placeholders
        'on-base':   '#E2E8F0', // Primary text on dark backgrounds
        // ── Semantic Aliases ─────────────────────────────────────────
        'income':    '#76E8B6', // Always mint for income indicators
        'expense':   '#F87171', // Red-400 for expense indicators
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow-mint': '0 0 20px 0 rgba(118, 232, 182, 0.15)',
        'glow-blue': '0 0 20px 0 rgba(75, 150, 243, 0.15)',
        'card':      '0 4px 24px 0 rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### 4.3 Dark Mode Enforcement

The root `<html>` element in `app/layout.tsx` must always carry the `dark` class:

```tsx
// app/layout.tsx — enforced
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-base text-on-base antialiased">{children}</body>
    </html>
  );
}
```

Do not make dark mode togglable in MVP. The UI is dark-mode only.

### 4.4 shadcn/ui Usage

- Install components via `npx shadcn@latest add <component>` — never copy-paste from the shadcn docs into arbitrary files.
- shadcn component source files live in `components/ui/`. Do not modify shadcn internals; extend via wrapper components.
- Override shadcn CSS variables in `app/globals.css` to align with the CashIt palette.

```css
/* app/globals.css — shadcn variable overrides for CashIt dark theme */
:root {
  --background:        15 20 30;   /* #0F141E */
  --foreground:        226 232 240; /* #E2E8F0 */
  --card:              22 28 42;   /* #161C2A */
  --card-foreground:   226 232 240;
  --primary:           118 232 182; /* #76E8B6 mint */
  --primary-foreground: 15 20 30;
  --secondary:         75 150 243; /* #4B96F3 blue */
  --secondary-foreground: 15 20 30;
  --border:            42 51 73;   /* #2A3349 */
  --muted:             100 116 139; /* #64748B */
  --muted-foreground:  100 116 139;
  --destructive:       239 68 68;  /* red-500 */
  --ring:              118 232 182;
  --radius:            0.75rem;
}
```

---

## 5. Brand Colour System

| Token | Hex | Tailwind Class | Usage |
|---|---|---|---|
| Mint Green | `#76E8B6` | `text-mint` / `bg-mint` | Income indicators, positive states, primary CTAs |
| Bright Blue | `#4B96F3` | `text-blue` / `bg-blue` | Navigation highlights, links, secondary CTAs |
| Dark Base | `#0F141E` | `bg-base` | Page background, deepest layer |
| Surface | `#161C2A` | `bg-surface` | Cards, panels, sidebar |
| Surface-2 | `#1E2636` | `bg-surface-2` | Modals, dropdown overlays |
| Border | `#2A3349` | `border-border` | All dividers and component borders |
| Expense Red | `#F87171` | `text-expense` | Expense indicators, destructive actions |

**Rules**:
- **Never hardcode hex values** in JSX. Always use the Tailwind token classes above.
- **Never use default Tailwind greens or blues** (e.g., `text-green-500`, `bg-blue-600`) — they violate brand consistency. Use `text-mint` and `text-blue` exclusively.

---

## 6. Logo & Image Handling

### 6.1 Logo File

The official CashIt logo is located at:

```
/public/LoDi-Create a combination o...-May 28 2026 12-43-kczxlq3m.jpg
```

This path is permanent. Do not rename or move this file.

### 6.2 Mandatory: Use Next.js `<Image />`

Raw `<img>` tags are **forbidden**. All image rendering must use `next/image`.

```tsx
// ✅ Correct: Navbar logo usage
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="flex items-center gap-3 px-6 py-4 bg-surface border-b border-border">
      <Image
        src="/LoDi-Create a combination o...-May 28 2026 12-43-kczxlq3m.jpg"
        alt="CashIt Logo"
        width={36}
        height={36}
        className="rounded-lg"
        priority
      />
      <span className="text-on-base font-semibold text-lg tracking-tight">CashIt</span>
    </nav>
  );
}
```

```tsx
// ✅ Correct: Login / landing page hero logo
import Image from 'next/image';

export function LoginHero() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        src="/LoDi-Create a combination o...-May 28 2026 12-43-kczxlq3m.jpg"
        alt="CashIt"
        width={80}
        height={80}
        className="rounded-2xl shadow-glow-mint"
        priority
      />
      <h1 className="text-3xl font-bold text-on-base">CashIt</h1>
      <p className="text-muted text-sm">Your money, in focus.</p>
    </div>
  );
}
```

### 6.3 `next.config.ts` — Image Configuration

Ensure `next.config.ts` allows the Google avatar domain for user profile images:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

## 7. Supabase Integration Rules

### 7.1 Client Selection by Context

| Context | Client to Use | Import Path |
|---|---|---|
| Server Component / Route Handler | `createServerClient()` | `@/lib/supabase/server` |
| Client Component / React hook | `createBrowserClient()` | `@/lib/supabase/client` |
| Edge Middleware | `createMiddlewareClient()` | `@supabase/ssr` |

**Never** use the browser client inside a Server Component or Route Handler.

### 7.2 RPC Calls — Preferred for Aggregations

Use Supabase RPC functions (defined in `SAD.md §5.5`) for all balance and analytics computations. Do not compute totals in JavaScript.

```typescript
// ✅ Correct: use RPC for wallet balances
const { data } = await supabase.rpc('get_wallet_balances', { p_user_id: userId });

// ❌ Forbidden: computing balances client-side
const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
```

### 7.3 Always Handle Errors

Every Supabase call must destructure and handle the `error` property:

```typescript
// ✅ Correct
const { data, error } = await supabase.from('wallets').select('*');
if (error) throw new Error(error.message);

// ❌ Forbidden — silent error swallowing
const { data } = await supabase.from('wallets').select('*');
```

### 7.4 Realtime Subscriptions

Realtime subscriptions belong only in custom hooks inside `hooks/`. They must always be cleaned up on unmount.

```typescript
// hooks/useSupabaseRealtime.ts — canonical pattern
useEffect(() => {
  const channel = supabase
    .channel(`user-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' },
      () => queryClient.invalidateQueries({ queryKey: ['transactions', userId] })
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [userId, supabase, queryClient]);
```

---

## 8. Data & State Management Rules

### 8.1 TanStack Query — Mandatory for Client-Side Server State

All server data fetched in Client Components must go through TanStack Query. No `fetch()` calls directly inside components.

```typescript
// ✅ Correct: hook in hooks/useWallets.ts
export function useWallets(userId: string) {
  return useQuery({
    queryKey: ['wallets', userId],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('wallets').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
  });
}
```

### 8.2 Optimistic Updates — Mandatory for Mutations

All write operations (insert, update, delete) must implement TanStack Query optimistic updates with rollback.

```typescript
// ✅ Correct pattern
const mutation = useMutation({
  mutationFn: insertTransaction,
  onMutate: async (newTxn) => {
    await queryClient.cancelQueries({ queryKey: ['transactions', userId] });
    const snapshot = queryClient.getQueryData(['transactions', userId]);
    queryClient.setQueryData(['transactions', userId], (old: Transaction[]) => [
      { ...newTxn, id: crypto.randomUUID() }, // optimistic row
      ...old,
    ]);
    return { snapshot };
  },
  onError: (_err, _vars, context) => {
    queryClient.setQueryData(['transactions', userId], context?.snapshot);
    toast.error('Failed to save transaction.');
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
  },
});
```

### 8.3 Query Key Convention

Query keys must follow the hierarchical array pattern:

```typescript
['wallets', userId]                          // all wallets for user
['wallets', userId, walletId]                // single wallet
['transactions', userId]                     // all transactions
['transactions', userId, { from, to }]       // date-filtered
['analytics', userId, 'category', { from, to }]
```

### 8.4 Monetary Display

Always format amounts using `Intl.NumberFormat`. Use the `formatIDR` utility from `lib/formatters.ts`:

```typescript
// lib/formatters.ts
export function formatIDR(amountInUnits: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amountInUnits);
}
```

---

## 9. Security Non-Negotiables

| Rule | Detail |
|---|---|
| No `localStorage` for auth tokens | Sessions are managed via HttpOnly cookies by `@supabase/ssr` only |
| No `SUPABASE_SERVICE_ROLE_KEY` in client | Must be `Server`-only; never prefixed with `NEXT_PUBLIC_` |
| No raw `<script>` injection | All dynamic scripts must go through Next.js Script component |
| Validate all inputs with Zod | Before any DB write; schema files in `lib/schemas/` |
| No `dangerouslySetInnerHTML` | Forbidden without explicit security review |
| Explicit column select | Never use `.select('*')` in production Route Handlers — select only needed columns |

---

## 10. File & Folder Conventions

```
cashit/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Route group for unauthenticated pages
│   ├── dashboard/        # Protected dashboard pages
│   └── api/              # Route Handlers
├── components/
│   ├── ui/               # shadcn/ui primitives (do not modify)
│   ├── dashboard/        # Dashboard-specific composed components
│   ├── transactions/     # Transaction-related components
│   ├── wallets/          # Wallet-related components
│   └── analytics/        # Chart and analytics components
├── hooks/                # Custom React hooks (client-side only)
├── lib/
│   ├── supabase/         # Supabase client factories
│   ├── schemas/          # Zod validation schemas
│   ├── formatters.ts     # Display utilities (formatIDR, formatDate)
│   └── constants.ts      # App-wide constants
├── types/
│   └── database.ts       # Supabase generated types (auto-generated, do not edit)
├── supabase/
│   └── migrations/       # SQL migration files (numbered, sequential)
└── public/               # Static assets (logo, icons)
```

**Rules**:
- New hooks go in `hooks/` — never inline in components.
- New Zod schemas go in `lib/schemas/` — never inline in form components.
- Never create a `utils/` folder — use `lib/` consistently.
- Never create a `helpers/` folder — classify as formatters, constants, or schemas.

---

## 11. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| React Components | PascalCase | `TransactionModal.tsx` |
| Hooks | camelCase, `use` prefix | `useTransactions.ts` |
| Utility functions | camelCase | `formatIDR`, `parseAmount` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_WALLET_NAME_LENGTH` |
| Types/Interfaces | PascalCase, no `I` prefix | `type WalletRow`, not `IWallet` |
| Zod schemas | camelCase, `Schema` suffix | `transactionInsertSchema` |
| Route Handlers | `route.ts` in folder | `app/api/wallets/route.ts` |
| DB migration files | `NNN_description.sql` | `001_create_users.sql` |
| CSS custom properties | kebab-case | `--color-mint` |

---

## 12. Prohibited Patterns

The AI must never generate these patterns:

```typescript
// ❌ 1. The `any` type — in any form
const data: any = ...;
function foo(x: any) { ... }
```

```typescript
// ❌ 2. Non-null assertion on Supabase results
const wallet = data!; // use explicit null check instead
```

```tsx
// ❌ 3. Raw <img> tag
<img src="/logo.jpg" alt="logo" />
// ✅ Use:
<Image src="/logo.jpg" alt="logo" width={36} height={36} />
```

```typescript
// ❌ 4. Hardcoded colour hex values in JSX/TSX
className="bg-[#76E8B6]"
// ✅ Use:
className="bg-mint"
```

```typescript
// ❌ 5. Client-side monetary aggregation
const total = txns.reduce((s, t) => s + t.amount, 0);
// ✅ Use RPC: supabase.rpc('get_wallet_balances', ...)
```

```typescript
// ❌ 6. Direct fetch() in a Client Component body
const res = await fetch('/api/wallets');
// ✅ Use a TanStack Query hook
```

```typescript
// ❌ 7. localStorage for any auth or financial data
localStorage.setItem('session', token);
```

```typescript
// ❌ 8. Default Tailwind colour classes that clash with brand
className="text-green-400 bg-blue-600"
// ✅ Use:
className="text-mint bg-blue"
```

---

## 13. Component Generation Checklist

When generating a new component, the AI must verify all items:

- [ ] **No `any`** — all props, return types, and local variables are fully typed
- [ ] **Server or Client** — `'use client'` is present only if event handlers or hooks are used
- [ ] **Logo via `<Image />`** — no raw `<img>` tags
- [ ] **Dark background** — component renders on `bg-base` or `bg-surface` correctly
- [ ] **Brand colours only** — no hardcoded hex, no default Tailwind colour classes
- [ ] **Zod validation** — all form inputs validated before submission
- [ ] **Error handling** — all Supabase calls handle the `error` property
- [ ] **Accessibility** — interactive elements have `aria-label` or visible label; focus rings visible against dark background
- [ ] **Monetary formatting** — amounts displayed via `formatIDR()`, never raw numbers
- [ ] **No inline styles** — all styling via Tailwind classes
- [ ] **`metadata` export** — present on all `page.tsx` files
- [ ] **Query key follows convention** — array format `[resource, userId, ...filters]`

---

*End of Agents.md v1.0.0 — CashIt*
