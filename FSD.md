# Functional Specification Document (FSD)
## CashIt — Personal Expense Tracker Web Application

> **Document Control**

| Field | Details |
|---|---|
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Author** | Engineering Lead |
| **Date Created** | 2026-05-28 |
| **References** | `SRS.md` v1.0.0, `PRD.md` v1.0.0 |

---

## Table of Contents

1. [Screen Inventory](#1-screen-inventory)
2. [Screen 1 — Login / Landing Page](#2-screen-1--login--landing-page)
3. [Screen 2 — Dashboard](#3-screen-2--dashboard)
4. [Screen 3 — Add / Edit Transaction Modal](#4-screen-3--add--edit-transaction-modal)
5. [Screen 4 — Wallet Management](#5-screen-4--wallet-management)
6. [Screen 5 — Analytics](#6-screen-5--analytics)
7. [Screen 6 — Profile & Settings](#7-screen-6--profile--settings)
8. [Cross-Cutting Concerns](#8-cross-cutting-concerns)
9. [Supabase API Reference](#9-supabase-api-reference)
10. [State Management Specification](#10-state-management-specification)
11. [Real-Time Subscription Specification](#11-real-time-subscription-specification)
12. [Error Handling Specification](#12-error-handling-specification)

---

## 1. Screen Inventory

| Screen | Route | Component Type | Auth Required |
|---|---|---|---|
| Login / Landing | `/` | Server Component (static) | No |
| Auth Callback | `/auth/callback` | Route Handler | No |
| Dashboard | `/dashboard` | Server + Client Components | Yes |
| Wallet Management | `/dashboard/wallets` | Client Component | Yes |
| Analytics | `/dashboard/analytics` | Client Component | Yes |
| Profile | `/dashboard/profile` | Client Component | Yes |
| Add/Edit Transaction | Modal (overlays dashboard) | Client Component | Yes |
| Add/Edit Wallet | Modal (overlays wallets page) | Client Component | Yes |

---

## 2. Screen 1 — Login / Landing Page

### 2.1 Route: `/`

**Rendering Strategy**: Static Server Component. No Supabase calls at render time. The page detects an active session via Next.js middleware and redirects to `/dashboard` if valid.

### 2.2 Middleware Session Check

**File**: `middleware.ts` (Vercel Edge Runtime)

```typescript
// Pseudocode — middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createServerClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const isProtected = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage = request.nextUrl.pathname === '/'

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return response
}
```

### 2.3 UI Specification

| Element | Detail |
|---|---|
| Background | Full viewport `#0F141E` |
| Logo | "CashIt" — "C" in `#76E8B6`, rest in `#F1F5F9`, Inter 800 |
| Tagline | `"Your money. Your clarity."` — `#94A3B8`, Inter 400 |
| CTA Button | `"Continue with Google"` — `#76E8B6` background, `#0F141E` text, Google logo SVG left |
| Footer | Privacy Policy link + financial disclaimer |

### 2.4 Supabase Interaction — Initiate Google OAuth

**Trigger**: User clicks "Continue with Google"  
**Client call**:

```typescript
// app/page.tsx (Client Component action)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    scopes: 'openid email profile',
  },
})
```

**Flow**:
1. Supabase generates PKCE code challenge + `state` parameter.
2. Browser is redirected to Google's consent screen.
3. On consent, Google redirects to `/auth/callback?code=...&state=...`.

### 2.5 Route Handler — `/auth/callback`

**File**: `app/auth/callback/route.ts`

```typescript
// Pseudocode
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createServerClient(/* cookies */)
    await supabase.auth.exchangeCodeForSession(code)
    // Session cookie written by @supabase/ssr automatically
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

**On success**: Session cookie set; redirects to `/dashboard`.  
**On failure**: Redirects to `/?error=auth_failed`.

### 2.6 Post-Auth User Sync

On first OAuth sign-in, Supabase Auth creates the user in `auth.users`. A **Postgres trigger** (`on_auth_user_created`) copies the user's `id`, `email`, `raw_user_meta_data->>'full_name'`, and `raw_user_meta_data->>'avatar_url'` into the public `users` table.

```sql
-- Migration: sync_user_on_create
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 3. Screen 2 — Dashboard

### 3.1 Route: `/dashboard`

**Rendering Strategy**: Server Component shell with embedded Client Components for reactive data.

### 3.2 Data Fetching Strategy

The Dashboard Server Component performs **parallel initial fetches** on the server, passes data as props to Client Components, which seed TanStack Query's cache:

```typescript
// app/dashboard/page.tsx (Server Component)
import { createServerClient } from '@supabase/ssr'

export default async function DashboardPage() {
  const supabase = createServerClient(/* cookies */)
  const { data: { user } } = await supabase.auth.getUser()

  const [walletsResult, transactionsResult] = await Promise.all([
    supabase.from('wallets').select('*').eq('user_id', user.id).order('created_at'),
    supabase.from('transactions').select('*').eq('user_id', user.id)
      .order('date', { ascending: false }).limit(10),
  ])

  return (
    <DashboardClient
      initialWallets={walletsResult.data ?? []}
      initialTransactions={transactionsResult.data ?? []}
      user={user}
    />
  )
}
```

### 3.3 Client Component — Dashboard

`DashboardClient` seeds TanStack Query cache with server data and subscribes to Supabase Realtime:

```typescript
// components/DashboardClient.tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime'

export function DashboardClient({ initialWallets, initialTransactions, user }) {
  const { data: wallets } = useQuery({
    queryKey: ['wallets', user.id],
    queryFn: () => fetchWallets(user.id),
    initialData: initialWallets,
    staleTime: 30_000,
  })

  const { data: transactions } = useQuery({
    queryKey: ['transactions', user.id],
    queryFn: () => fetchRecentTransactions(user.id),
    initialData: initialTransactions,
    staleTime: 30_000,
  })

  // Realtime subscription (see §11)
  useSupabaseRealtime(user.id)

  const totalBalance = wallets?.reduce((sum, w) => sum + w.balance, 0) ?? 0
  // ... render
}
```

### 3.4 Dashboard UI Components

| Component | Data Source | Description |
|---|---|---|
| `<TotalBalanceCard>` | Computed from `wallets` query | Large balance display; mint if ≥ 0, red if < 0 |
| `<PeriodSummaryCards>` | Supabase RPC `get_period_summary(userId, period)` | Income vs. Expense side-by-side cards |
| `<WalletRow>` | `wallets` query | Horizontally scrollable wallet cards |
| `<RecentTransactionsList>` | `transactions` query (limit 10) | Chronological list with category icon, amount, wallet tag |
| `<AddTransactionFAB>` | — | Persistent FAB; opens `<TransactionModal>` |

### 3.5 Balance Aggregation — Supabase RPC

Wallet balance is never computed client-side from raw rows. A Postgres function computes it:

```sql
-- Migration: compute_wallet_balance
CREATE OR REPLACE FUNCTION get_wallet_balances(p_user_id UUID)
RETURNS TABLE(wallet_id UUID, balance BIGINT) AS $$
  SELECT
    wallet_id,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
  FROM transactions
  WHERE user_id = p_user_id
  GROUP BY wallet_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

Client call:

```typescript
const { data } = await supabase.rpc('get_wallet_balances', { p_user_id: userId })
```

---

## 4. Screen 3 — Add / Edit Transaction Modal

### 4.1 Component: `<TransactionModal>`

**Type**: Client Component  
**Trigger**: FAB click (add) or transaction row click (edit)  
**Layout**: Centered modal (desktop), bottom sheet (mobile ≤ 768px)

### 4.2 Form Fields

| Field | Input Type | Validation (Zod) |
|---|---|---|
| `type` | Pill toggle: Income / Expense | `z.enum(['income', 'expense'])` |
| `amount` | Number input | `z.number().int().min(1).max(9_999_999_999)` |
| `category` | Icon grid picker | `z.string().min(1)` (from categories table) |
| `wallet_id` | Dropdown (user's wallets) | `z.string().uuid()` |
| `date` | Date picker | `z.string().refine(d => d <= today)` |
| `note` | Textarea | `z.string().max(120).optional()` |

### 4.3 Add Transaction — Supabase Interaction

**Optimistic update pattern with TanStack Query**:

```typescript
const queryClient = useQueryClient()
const { mutate: addTransaction } = useMutation({
  mutationFn: async (payload: NewTransaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        wallet_id: payload.wallet_id,
        type: payload.type,
        amount: payload.amount,          // INTEGER: no decimals
        category: payload.category,
        note: payload.note ?? null,
        date: payload.date,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },
  onMutate: async (newTxn) => {
    // 1. Cancel in-flight queries
    await queryClient.cancelQueries({ queryKey: ['transactions', userId] })
    // 2. Snapshot previous state
    const previousTxns = queryClient.getQueryData(['transactions', userId])
    // 3. Optimistically insert
    queryClient.setQueryData(['transactions', userId], (old: Transaction[]) => [
      { ...newTxn, id: 'temp-id', created_at: new Date().toISOString() },
      ...old,
    ])
    return { previousTxns }
  },
  onError: (_err, _newTxn, context) => {
    // Rollback on failure
    queryClient.setQueryData(['transactions', userId], context?.previousTxns)
    toast.error('Failed to save transaction. Please try again.')
  },
  onSuccess: () => {
    toast.success('Transaction saved!')
    queryClient.invalidateQueries({ queryKey: ['transactions', userId] })
    queryClient.invalidateQueries({ queryKey: ['wallets', userId] })
  },
})
```

### 4.4 Edit Transaction — Supabase Interaction

```typescript
const { mutate: editTransaction } = useMutation({
  mutationFn: async ({ id, ...payload }: UpdateTransaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)  // RLS guard at app layer too
      .select()
      .single()
    if (error) throw error
    return data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions', userId] })
    queryClient.invalidateQueries({ queryKey: ['wallets', userId] })
  },
})
```

### 4.5 Delete Transaction — Supabase Interaction

```typescript
const { mutate: deleteTransaction } = useMutation({
  mutationFn: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
  },
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['transactions', userId] })
    const previous = queryClient.getQueryData(['transactions', userId])
    queryClient.setQueryData(['transactions', userId], (old: Transaction[]) =>
      old.filter(t => t.id !== id)
    )
    return { previous }
  },
  onError: (_err, _id, context) => {
    queryClient.setQueryData(['transactions', userId], context?.previous)
    toast.error('Failed to delete transaction.')
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['wallets', userId] })
  },
})
```

---

## 5. Screen 4 — Wallet Management

### 5.1 Route: `/dashboard/wallets`

### 5.2 Create Wallet — Supabase Interaction

```typescript
const { mutate: createWallet } = useMutation({
  mutationFn: async (payload: { name: string; icon: string }) => {
    // Enforce 10-wallet limit at app layer before DB call
    const currentCount = queryClient.getQueryData<Wallet[]>(['wallets', userId])?.length ?? 0
    if (currentCount >= 10) throw new Error('WALLET_LIMIT_REACHED')

    const { data, error } = await supabase
      .from('wallets')
      .insert({ user_id: userId, name: payload.name, icon: payload.icon })
      .select()
      .single()
    if (error) throw error
    return data
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets', userId] }),
})
```

### 5.3 Delete Wallet — Supabase Interaction

Before deletion, verify zero transactions:

```typescript
const { mutate: deleteWallet } = useMutation({
  mutationFn: async (walletId: string) => {
    const { count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('wallet_id', walletId)
      .eq('user_id', userId)

    if ((count ?? 0) > 0) throw new Error('WALLET_HAS_TRANSACTIONS')

    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id', walletId)
      .eq('user_id', userId)
    if (error) throw error
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets', userId] }),
})
```

---

## 6. Screen 5 — Analytics

### 6.1 Route: `/dashboard/analytics`

### 6.2 Data Fetch — Supabase RPC

```typescript
// Supabase Postgres function
CREATE OR REPLACE FUNCTION get_category_breakdown(
  p_user_id UUID,
  p_from DATE,
  p_to DATE
)
RETURNS TABLE(category TEXT, total BIGINT) AS $$
  SELECT category, SUM(amount) AS total
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'expense'
    AND date BETWEEN p_from AND p_to
  GROUP BY category
  ORDER BY total DESC;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

Client Query:

```typescript
const { data: breakdown } = useQuery({
  queryKey: ['analytics', userId, period],
  queryFn: async () => {
    const { from, to } = getPeriodDates(period) // utility
    const { data, error } = await supabase.rpc('get_category_breakdown', {
      p_user_id: userId,
      p_from: from,
      p_to: to,
    })
    if (error) throw error
    return data
  },
  staleTime: 60_000,
})
```

### 6.3 Chart Rendering (Recharts)

```typescript
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={breakdown}
      dataKey="total"
      nameKey="category"
      innerRadius="55%"
      outerRadius="80%"
    >
      {breakdown.map((entry) => (
        <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
      ))}
    </Pie>
    <Tooltip formatter={(value) => formatIDR(value as number)} />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

---

## 7. Screen 6 — Profile & Settings

### 7.1 Route: `/dashboard/profile`

### 7.2 Data Source

User profile data fetched from `public.users` table (not `auth.users`) via:

```typescript
const { data: profile } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => supabase.from('users').select('*').eq('id', userId).single(),
})
```

### 7.3 Account Deletion Flow

1. User clicks "Delete Account" → confirmation dialog appears.
2. On confirm → calls `/api/user/delete` Route Handler.
3. Route Handler uses `service_role` key to delete `auth.users` record (cascades to `public.users` via FK).
4. Client calls `supabase.auth.signOut()` → redirect to `/`.

---

## 8. Cross-Cutting Concerns

### 8.1 Authentication Guard (Middleware)

All `/dashboard/*` routes are protected by `middleware.ts`. The middleware runs on the Vercel Edge Runtime on every request, reads the session cookie via `@supabase/ssr`, and refreshes the JWT if needed before forwarding the request.

### 8.2 Toast Notification System

All async operations (create, update, delete) emit toast notifications:
- **Success**: `toast.success(message)` — appears bottom-right, auto-dismisses in 3s
- **Error**: `toast.error(message)` — appears bottom-right, requires manual dismiss or 6s timeout
- **Loading**: `toast.loading(message)` — shown during in-flight mutations

### 8.3 Loading States

All data-dependent UI must implement loading skeletons using CSS animated placeholders matching the card dimensions. No raw "Loading..." text.

### 8.4 Currency Formatting

```typescript
// lib/formatters.ts
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
// Example: 50000 → "Rp 50.000"
```

---

## 9. Supabase API Reference

### 9.1 Standard Query Patterns

| Operation | Supabase JS v2 Call |
|---|---|
| Fetch all wallets | `supabase.from('wallets').select('*').eq('user_id', uid).order('created_at')` |
| Fetch recent transactions | `supabase.from('transactions').select('*').eq('user_id', uid).order('date', { ascending: false }).limit(10)` |
| Insert transaction | `supabase.from('transactions').insert({...}).select().single()` |
| Update transaction | `supabase.from('transactions').update({...}).eq('id', id).eq('user_id', uid)` |
| Delete transaction | `supabase.from('transactions').delete().eq('id', id).eq('user_id', uid)` |
| Wallet balance RPC | `supabase.rpc('get_wallet_balances', { p_user_id: uid })` |
| Analytics RPC | `supabase.rpc('get_category_breakdown', { p_user_id, p_from, p_to })` |

### 9.2 Supabase Client Instances

| Context | Factory | Key Used |
|---|---|---|
| Server Component / Route Handler | `createServerClient()` from `@supabase/ssr` | `anon` key + cookies |
| Client Component | `createBrowserClient()` from `@supabase/ssr` | `anon` key |
| Admin Route Handler (user deletion) | `createClient(url, service_role_key)` | `service_role` key |

---

## 10. State Management Specification

### 10.1 TanStack Query Key Convention

```
['wallets', userId]                    — user's wallet list
['transactions', userId]               — all user transactions (paginated)
['transactions', userId, walletId]     — filtered by wallet
['analytics', userId, period]          — category breakdown
['profile', userId]                    — user profile
```

### 10.2 Cache Invalidation Rules

| Event | Invalidated Keys |
|---|---|
| Transaction created / updated / deleted | `['transactions', userId]`, `['wallets', userId]`, `['analytics', userId, *]` |
| Wallet created / updated / deleted | `['wallets', userId]` |
| Profile updated | `['profile', userId]` |

### 10.3 staleTime Configuration

| Query Key | staleTime |
|---|---|
| `wallets` | 30 seconds |
| `transactions` | 30 seconds |
| `analytics` | 60 seconds |
| `profile` | 300 seconds |

---

## 11. Real-Time Subscription Specification

### 11.1 Hook: `useSupabaseRealtime`

```typescript
// hooks/useSupabaseRealtime.ts
'use client'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'

export function useSupabaseRealtime(userId: string) {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient(...)

  useEffect(() => {
    const channel = supabase
      .channel(`user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Invalidate on any INSERT, UPDATE, DELETE
          queryClient.invalidateQueries({ queryKey: ['transactions', userId] })
          queryClient.invalidateQueries({ queryKey: ['wallets', userId] })
          queryClient.invalidateQueries({ queryKey: ['analytics', userId] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['wallets', userId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient, supabase])
}
```

### 11.2 Real-Time Data Flow

```
User saves transaction
  → supabase.from('transactions').insert(...)   [client mutation]
  → Optimistic update applied to TanStack Query cache immediately
  → Supabase confirms write (< 200ms)
  → Postgres WAL emits change event
  → Supabase Realtime broadcasts to user-{userId} channel (< 300ms)
  → useSupabaseRealtime handler fires
  → queryClient.invalidateQueries(...)
  → TanStack Query re-fetches fresh data
  → UI re-renders with authoritative server data (< 500ms total)
```

---

## 12. Error Handling Specification

### 12.1 Error Categories & Responses

| Error Type | Source | User-Facing Response |
|---|---|---|
| Auth expired | `supabase.auth.getUser()` returns null | Middleware redirects to `/` |
| RLS violation | Supabase returns `403` | Toast: "You don't have permission to do that." |
| Wallet limit | App-layer check | Toast: "Wallet limit reached (max 10)." |
| Wallet has transactions | Delete guard | Modal warning: "Remove all transactions first." |
| Validation error | Zod `safeParse` fail | Inline field error below input |
| Network failure | Fetch throws | Toast: "Connection issue. Retrying..." + TQ auto-retry |
| Unknown server error | 5xx from Supabase | Toast: "Something went wrong. Please try again." + Sentry log |

### 12.2 Zod Validation Example

```typescript
// lib/schemas/transaction.ts
import { z } from 'zod'

export const NewTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().int().min(1).max(9_999_999_999),
  category: z.string().min(1),
  wallet_id: z.string().uuid(),
  date: z.string().refine(
    (d) => new Date(d) <= new Date(),
    { message: 'Date cannot be in the future' }
  ),
  note: z.string().max(120).optional(),
})

export type NewTransaction = z.infer<typeof NewTransactionSchema>
```

---

*End of FSD v1.0.0 — CashIt*
