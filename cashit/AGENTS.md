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
import type { Database } from '@/types/database';

type Wallet = Database['public']['Tables']['wallets']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
```

### 2.4 Zod Schemas

All user-submitted data must be validated with a Zod schema defined in `lib/schemas/` before any Supabase operation.

```typescript
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
import { createServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: wallets } = await supabase.from('wallets').select('*');
  return <DashboardClient wallets={wallets ?? []} />;
}
```

### 3.3 Route Handler Structure

```typescript
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

## 4. Styling System — Tailwind CSS v4 + shadcn/ui

### 4.1 Tailwind v4 — CSS-Native Configuration

This project uses **Tailwind CSS v4**. There is **no `tailwind.config.ts`**. All theme tokens are defined directly in `src/app/globals.css` using the `@theme` block.

```css
/* src/app/globals.css — Tailwind v4 theme block */
@import "tailwindcss";

@theme {
  --color-mint:      #76E8B6;
  --color-blue:      #4B96F3;
  --color-base:      #0F141E;
  --color-surface:   #161C2A;
  --color-surface-2: #1E2636;
  --color-border:    #2A3349;
  --color-muted:     #64748B;
  --color-on-base:   #E2E8F0;
  --color-income:    #76E8B6;
  --color-expense:   #F87171;
}
```

### 4.2 Constraints

- **No inline `style` props** unless absolutely required for dynamic CSS custom properties.
- **No CSS Modules** — all styles via Tailwind utility classes.
- **No external UI libraries** other than `shadcn/ui`.

### 4.3 Dark Mode Enforcement

The root `<html>` element in `app/layout.tsx` must always carry the `dark` class. The UI is dark-mode only (no toggle in MVP).

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-base text-on-base antialiased">{children}</body>
    </html>
  );
}
```

### 4.4 shadcn/ui Usage

- Install via `npx shadcn@latest add <component>` — never copy-paste from docs.
- shadcn source files live in `components/ui/`. Do not modify internals; extend via wrappers.
- Override shadcn CSS variables in `app/globals.css`.

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
- **Never use default Tailwind greens or blues** (e.g., `text-green-500`, `bg-blue-600`).

---

## 6. Logo & Image Handling

### 6.1 Logo File

The official CashIt logo is located at:

```
/public/logo.png
```

### 6.2 Mandatory: Use Next.js `<Image />`

Raw `<img>` tags are **forbidden**. All image rendering must use `next/image`.

```tsx
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="flex items-center gap-3 px-6 py-4 bg-surface border-b border-border">
      <Image
        src="/logo.png"
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

### 6.3 `next.config.ts` — Image Configuration

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
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

### 7.2 RPC Calls — Preferred for Aggregations

```typescript
const { data } = await supabase.rpc('get_wallet_balances', { p_user_id: userId });
```

### 7.3 Always Handle Errors

```typescript
const { data, error } = await supabase.from('wallets').select('*');
if (error) throw new Error(error.message);
```

### 7.4 Realtime Subscriptions

Realtime subscriptions belong only in custom hooks inside `hooks/`. They must always be cleaned up on unmount.

---

## 8. Data & State Management Rules

### 8.1 TanStack Query — Mandatory for Client-Side Server State

All server data fetched in Client Components must go through TanStack Query. No `fetch()` calls directly inside components.

### 8.2 Optimistic Updates — Mandatory for Mutations

All write operations must implement TanStack Query optimistic updates with rollback.

### 8.3 Query Key Convention

```typescript
['wallets', userId]
['wallets', userId, walletId]
['transactions', userId]
['transactions', userId, { from, to }]
['analytics', userId, 'category', { from, to }]
```

### 8.4 Monetary Display

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
| No `localStorage` for auth tokens | Sessions via HttpOnly cookies (`@supabase/ssr`) only |
| No `SUPABASE_SERVICE_ROLE_KEY` in client | Server-only; never `NEXT_PUBLIC_` prefixed |
| No raw `<script>` injection | Use Next.js Script component |
| Validate all inputs with Zod | Before any DB write; schema files in `lib/schemas/` |
| No `dangerouslySetInnerHTML` | Forbidden without explicit security review |
| Explicit column select | Never `.select('*')` in production Route Handlers |

---

## 10. File & Folder Conventions

```
cashit/
├── app/
│   ├── (auth)/           # Unauthenticated pages (login, register)
│   ├── dashboard/        # Protected dashboard pages
│   └── api/              # Route Handlers
├── components/
│   ├── ui/               # shadcn/ui primitives (do not modify)
│   ├── dashboard/
│   ├── transactions/
│   ├── wallets/
│   └── analytics/
├── hooks/                # Custom React hooks (client-side only)
├── lib/
│   ├── supabase/         # Supabase client factories
│   ├── schemas/          # Zod validation schemas
│   ├── formatters.ts
│   └── constants.ts
├── types/
│   └── database.ts       # Supabase generated types (auto-generated)
├── supabase/
│   └── migrations/       # SQL migrations (numbered, sequential)
└── public/
```

---

## 11. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| React Components | PascalCase | `TransactionModal.tsx` |
| Hooks | camelCase, `use` prefix | `useTransactions.ts` |
| Utility functions | camelCase | `formatIDR`, `parseAmount` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_WALLET_NAME_LENGTH` |
| Types/Interfaces | PascalCase, no `I` prefix | `type WalletRow` |
| Zod schemas | camelCase, `Schema` suffix | `transactionInsertSchema` |
| Route Handlers | `route.ts` in folder | `app/api/wallets/route.ts` |
| DB migration files | `NNN_description.sql` | `001_create_users.sql` |

---

## 12. Prohibited Patterns

```typescript
// ❌ The `any` type
const data: any = ...;

// ❌ Non-null assertion on Supabase results
const wallet = data!;

// ❌ Raw <img> tag — use <Image /> from next/image

// ❌ Hardcoded hex in JSX
className="bg-[#76E8B6]"  // ✅ use: className="bg-mint"

// ❌ Client-side monetary aggregation
const total = txns.reduce((s, t) => s + t.amount, 0);

// ❌ Direct fetch() in Client Component body

// ❌ localStorage for auth or financial data

// ❌ Default Tailwind colour classes
className="text-green-400 bg-blue-600"  // ✅ use: className="text-mint bg-blue"
```

---

## 13. Component Generation Checklist

- [ ] **No `any`** — all props, return types, and local variables are fully typed
- [ ] **Server or Client** — `'use client'` only if event handlers or hooks are used
- [ ] **Logo via `<Image />`** — no raw `<img>` tags
- [ ] **Dark background** — renders correctly on `bg-base` or `bg-surface`
- [ ] **Brand colours only** — no hardcoded hex, no default Tailwind colour classes
- [ ] **Zod validation** — all form inputs validated before submission
- [ ] **Error handling** — all Supabase calls handle the `error` property
- [ ] **Accessibility** — interactive elements have `aria-label` or visible label
- [ ] **Monetary formatting** — amounts via `formatIDR()`, never raw numbers
- [ ] **No inline styles** — all styling via Tailwind classes
- [ ] **`metadata` export** — present on all `page.tsx` files
- [ ] **Query key convention** — array format `[resource, userId, ...filters]`

---

*End of Agents.md v1.0.0 — CashIt*
