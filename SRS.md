# Software Requirements Specification (SRS)
## CashIt — Personal Expense Tracker Web Application

> **Document Control**

| Field | Details |
|---|---|
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Author** | Engineering Lead |
| **Date Created** | 2026-05-28 |
| **References** | `BRD.md` v1.0.0, `PRD.md` v1.0.0 |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements Summary](#3-functional-requirements-summary)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Constraints](#5-system-constraints)
6. [Security Requirements](#6-security-requirements)
7. [Performance Requirements](#7-performance-requirements)
8. [Data Requirements](#8-data-requirements)
9. [Interface Requirements](#9-interface-requirements)
10. [Deployment & Infrastructure Requirements](#10-deployment--infrastructure-requirements)
11. [Compliance & Regulatory Requirements](#11-compliance--regulatory-requirements)
12. [Verification & Validation](#12-verification--validation)
13. [Requirement Traceability Matrix](#13-requirement-traceability-matrix)

---

## 1. Introduction

### 1.1 Purpose

This SRS defines the complete technical, functional, and non-functional requirements for CashIt. It serves as the binding engineering reference and provides the basis for verification and validation of the delivered system.

### 1.2 Scope

CashIt is a server-rendered, real-time web application built with **Next.js 14+ (App Router)** and **TypeScript**, authenticated and persisted via **Supabase** (PostgreSQL + Google OAuth), and deployed to **Vercel**. The system enables authenticated users to manage multiple named wallets, log income/expense transactions, and view live financial analytics via a dark-mode-first interface.

### 1.3 Definitions

| Term | Meaning |
|---|---|
| **RLS** | Row Level Security — PostgreSQL policy enforcing per-user data isolation |
| **RSC** | React Server Component — executes on the server, ships zero client JS |
| **RQ** | React Query / TanStack Query v5 — async state and caching library |
| **SSR** | Server-Side Rendering — page rendered on the server per request |
| **PKCE** | Proof Key for Code Exchange — OAuth 2.0 extension preventing code interception |
| **PITR** | Point-in-Time Recovery — continuous database backup capability |

---

## 2. System Overview

### 2.1 Architecture Summary

| Layer | Technology |
|---|---|
| **Framework** | Next.js ≥ 14.2, App Router, TypeScript strict mode |
| **Auth & DB** | Supabase (PostgreSQL 15, Supabase Auth) |
| **Supabase SSR adapter** | `@supabase/ssr` ≥ 0.4 |
| **Client state** | TanStack Query ≥ 5.x (single source of truth) |
| **Charts** | Recharts (OSS, MIT) |
| **CSS** | CSS Modules + CSS Custom Properties |
| **Deployment** | Vercel (Edge Middleware, Serverless Functions) |
| **Package manager** | pnpm ≥ 9.x |

---

## 3. Functional Requirements Summary

| Req ID | PRD Source | Description |
|---|---|---|
| FR-AUTH-01 | US-AUTH-01 | Google OAuth 2.0 is the sole authentication method |
| FR-AUTH-02 | US-AUTH-02 | Sessions persist across reloads for ≤ 7 days |
| FR-AUTH-03 | US-AUTH-03 | Sign-out invalidates all session tokens |
| FR-AUTH-04 | AC-AUTH-09 | Unauthenticated requests redirect to `/` via Next.js middleware |
| FR-WALLET-01 | US-WALLET-01 | Authenticated users can create wallets with name + emoji icon |
| FR-WALLET-02 | AC-WALLET-02 | Maximum 10 wallets per user, enforced at API layer |
| FR-WALLET-03 | AC-WALLET-04 | Wallet balance = SUM(income) − SUM(expense), computed server-side |
| FR-WALLET-04 | AC-WALLET-06 | Wallets with associated transactions cannot be deleted |
| FR-TXN-01 | US-TXN-01 | Transactions require: type, amount, category, wallet, date |
| FR-TXN-02 | AC-TXN-03 | Monetary amounts stored as INTEGER (BIGINT) |
| FR-TXN-03 | AC-TXN-04 | Future-dated transactions are rejected at validation layer |
| FR-TXN-04 | US-TXN-04 | Full edit of existing transactions is supported |
| FR-TXN-05 | US-TXN-05 | Permanent deletion with confirmation dialog |
| FR-DASH-01 | US-DASH-01 | Aggregated balance figures delivered reactively |
| FR-DASH-02 | AC-DASH-07 | Dashboard updates within 500ms of any transaction write |
| FR-ANA-01 | US-ANALYTICS-01 | Category-aggregated expense data for chart rendering |
| FR-ANA-02 | AC-ANA-06 | Time-period filter: This Month / Last 7 Days / Last 30 Days / All Time |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| NFR ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | Largest Contentful Paint (LCP) | < 2.5s on simulated 4G |
| NFR-PERF-02 | Interaction to Next Paint (INP) | < 200ms |
| NFR-PERF-03 | Cumulative Layout Shift (CLS) | < 0.1 |
| NFR-PERF-04 | Time to First Byte (TTFB) | < 600ms |
| NFR-PERF-05 | Dashboard initial data load | < 1,000ms |
| NFR-PERF-06 | Transaction save → UI update | < 500ms end-to-end |
| NFR-PERF-07 | Gzipped JS bundle (initial) | < 200KB |
| NFR-PERF-08 | Supabase DB query p99 | < 100ms |

### 4.2 Scalability

| NFR ID | Requirement |
|---|---|
| NFR-SCALE-01 | Handle 10,000 concurrent sessions via Vercel serverless infrastructure |
| NFR-SCALE-02 | DB queries use indexed columns; sub-100ms at 1M transactions/user |
| NFR-SCALE-03 | Supabase Realtime channels scoped per-user to prevent broadcast overhead |

### 4.3 Reliability

| NFR ID | Target |
|---|---|
| NFR-REL-01 | Uptime ≥ 99.5% monthly |
| NFR-REL-02 | API 5xx error rate < 0.5% |
| NFR-REL-03 | Data durability ≥ 99.99% (Supabase PITR) |
| NFR-REL-04 | TanStack Query auto-retry: 3 attempts with exponential back-off |

### 4.4 Maintainability

| NFR ID | Requirement |
|---|---|
| NFR-MAINT-01 | TypeScript `strict: true`; no `any` in production code |
| NFR-MAINT-02 | Unit test coverage ≥ 70% for utility functions and API handlers |
| NFR-MAINT-03 | Schema changes managed via Supabase CLI migration files |
| NFR-MAINT-04 | Secrets never committed to version control |

### 4.5 Accessibility

| NFR ID | Requirement |
|---|---|
| NFR-ACC-01 | Lighthouse Accessibility score ≥ 85 |
| NFR-ACC-02 | Color contrast ≥ 4.5:1 for normal text (WCAG 2.1 AA) |
| NFR-ACC-03 | All interactive elements keyboard-navigable |
| NFR-ACC-04 | Chart elements expose ARIA labels and tabular data alternative |
| NFR-ACC-05 | Focus indicator: `2px solid #76E8B6` on all focusable elements |

---

## 5. System Constraints

### 5.1 Technical Constraints

| ID | Constraint | Rationale |
|---|---|---|
| SC-01 | Next.js App Router + TypeScript exclusively | Server component optimizations + type safety |
| SC-02 | Deployment to Vercel only | Edge caching, CI/CD, preview deployments |
| SC-03 | Supabase Auth + Google OAuth 2.0 exclusively | No email/password in MVP |
| SC-04 | Supabase PostgreSQL exclusively | No ORM abstraction; raw Supabase client |
| SC-05 | Monetary values as **BIGINT** (INTEGER) | Eliminates IEEE 754 floating-point errors |
| SC-06 | Client state from TanStack Query only | No Redux, no Zustand, no Context for server data |
| SC-07 | RLS **ENABLED + default-deny** on all tables | Data isolation at DB layer, not just app layer |
| SC-08 | No `localStorage`/`sessionStorage` for auth or financial data | Prevents XSS token theft |

### 5.2 Design Constraints

| ID | Constraint |
|---|---|
| SC-D01 | Dark-mode-first; no light mode in MVP |
| SC-D02 | Background: `#0F141E` (page), `#111827` (cards), `#1A2236` (inputs) |
| SC-D03 | Accents: `#76E8B6` mint (primary), `#4B96F3` blue (secondary), `#F87171` red (destructive) |
| SC-D04 | Typography: Inter (UI) + JetBrains Mono (amounts) from Google Fonts |

---

## 6. Security Requirements

### 6.1 Session Security

| SR ID | Requirement |
|---|---|
| SR-AUTH-01 | Sessions stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies via `@supabase/ssr` |
| SR-AUTH-02 | JWT access tokens expire ≤ 1 hour; silent refresh via Supabase refresh token |
| SR-AUTH-03 | Session refresh runs in Next.js middleware on every request |
| SR-AUTH-04 | OAuth `state` parameter validated to prevent CSRF on callback |
| SR-AUTH-05 | Google OAuth scopes: `openid`, `email`, `profile` only |

### 6.2 Data Access (RLS Policies)

| SR ID | Table | Policy |
|---|---|---|
| SR-RLS-01 | `users` | SELECT / UPDATE where `auth.uid() = id` |
| SR-RLS-02 | `wallets` | All CRUD where `auth.uid() = user_id` |
| SR-RLS-03 | `categories` | SELECT for all authenticated users; write restricted to `service_role` |
| SR-RLS-04 | `transactions` | All CRUD where `auth.uid() = user_id` |
| SR-RLS-05 | All tables | Default-deny (no policy = no access) |

### 6.3 Input Validation

| SR ID | Requirement |
|---|---|
| SR-INP-01 | All inputs validated with **Zod** schemas before DB writes |
| SR-INP-02 | Supabase parameterized queries only — no raw SQL interpolation |
| SR-INP-03 | `amount`: positive integer, 1 ≤ value ≤ 9,999,999,999 |
| SR-INP-04 | `wallet.name`: 3–30 UTF-8 characters |
| SR-INP-05 | `transaction.note`: ≤ 120 characters |
| SR-INP-06 | `transaction.date`: ≤ today (ISO 8601), future dates rejected |

### 6.4 Transport & Headers

| SR ID | Requirement |
|---|---|
| SR-TLS-01 | HTTPS/TLS 1.2+ enforced by Vercel |
| SR-TLS-02 | HSTS header: `max-age=31536000; includeSubDomains` |
| SR-TLS-03 | CSP header whitelists: self, Google Fonts CDN, Supabase endpoints only |

---

## 7. Performance Requirements — Caching Strategy

| Cache Target | Strategy | TTL |
|---|---|---|
| Landing page `/` | SSG — no auth dependency | 24h (stale-while-revalidate) |
| Dashboard HTML shell | Static shell + client hydration | Immutable |
| Wallet + transaction data | TanStack Query; server-seeded | `staleTime: 30s` |
| Analytics aggregation | Supabase RPC + TanStack Query | `staleTime: 60s` |
| Google Fonts | CDN immutable | Browser ∞ |

> **Rule**: No financial user data is cached at the Vercel CDN layer. All user-specific data is fetched per-request from Supabase, preventing cross-user data leakage via shared CDN caches.

### Query Optimization

| QR ID | Requirement |
|---|---|
| QR-01 | Composite index on `transactions(user_id, date DESC)` |
| QR-02 | Index on `transactions(user_id, wallet_id, date DESC)` |
| QR-03 | Balance aggregation via Postgres RPC function, not client-side JS |
| QR-04 | Dashboard initial load batches wallet list + recent transactions in one parallel fetch |
| QR-05 | Analytics aggregation executes server-side via Supabase RPC |

---

## 8. Data Requirements

### 8.1 Monetary Values

All `amount` fields stored as **PostgreSQL `BIGINT`** representing whole IDR units. Example: Rp 50,000 → `50000`. The display layer formats integers to locale strings. This eliminates floating-point accumulation errors.

### 8.2 Retention & Deletion

| DR ID | Requirement |
|---|---|
| DR-01 | Users can request full account deletion (GDPR/PDPA right to erasure) |
| DR-02 | Account deletion cascades to wallets and transactions |
| DR-03 | No soft-delete in MVP; deletions are permanent |
| DR-04 | Auth identity removed from Supabase Auth on account deletion |
| DR-05 | Supabase PITR enabled; daily backups with ≥ 7-day retention |

---

## 9. Interface Requirements

### 9.1 External APIs

| Interface | Provider | Purpose |
|---|---|---|
| Google OAuth 2.0 | Google Cloud | Delegated authentication via Supabase Auth |
| Supabase REST | Supabase | CRUD operations |
| Supabase Realtime | Supabase | Postgres change subscriptions |
| Supabase Auth | Supabase | Session management |

### 9.2 Internal Route Handlers

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/callback` | GET | OAuth code exchange |
| `/api/wallets` | GET, POST | List / create wallets |
| `/api/wallets/[id]` | PATCH, DELETE | Update / delete wallet |
| `/api/transactions` | GET, POST | List / create transactions |
| `/api/transactions/[id]` | PATCH, DELETE | Update / delete transaction |
| `/api/analytics` | GET | Category aggregation for charts |
| `/api/user/delete` | DELETE | Permanent account deletion |

---

## 10. Deployment & Infrastructure Requirements

| ID | Requirement |
|---|---|
| IR-01 | Production branch: `main`; Vercel preview on every PR |
| IR-02 | Env vars set in Vercel project settings: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| IR-03 | Edge Middleware runs on Vercel Edge Runtime for minimal cold-start |
| IR-04 | Supabase region: `ap-southeast-1` (Singapore) for SEA latency |
| IR-05 | Supabase Auth allow-list includes production URL + Vercel preview URL patterns |
| IR-06 | CI: GitHub Actions — lint → type-check → unit tests on every PR |
| IR-07 | Failed CI blocks PR merge |

---

## 11. Compliance & Regulatory Requirements

| CR ID | Requirement |
|---|---|
| CR-01 | Privacy Policy page accessible from footer before authentication |
| CR-02 | OAuth consent screen states data collected: name, email, avatar |
| CR-03 | Account deletion fulfillable within 30 days of request (GDPR Art. 17) |
| CR-04 | No financial data transmitted to third-party analytics or ad systems |
| CR-05 | Sentry (or equivalent) scrubs PII and monetary values from error reports |
| CR-06 | Footer disclaimer: *"CashIt is a personal tracking tool only. It does not constitute financial advice or a regulated financial service."* |

---

## 12. Verification & Validation

| Test Type | Tool | Coverage Target |
|---|---|---|
| Unit | Vitest | ≥ 70% utilities, schemas, formatters |
| Integration | Vitest + Supabase local | ≥ 70% API route handlers |
| Component | React Testing Library | ≥ 60% core UI components |
| E2E | Playwright | Auth, Add Wallet, Add Transaction, Dashboard update |
| Performance | Lighthouse CI | LCP < 2.5s, Accessibility ≥ 85 |

---

## 13. Requirement Traceability Matrix

| SRS ID | PRD AC | BRD Objective |
|---|---|---|
| FR-AUTH-01 | AC-AUTH-01 | BO-01 |
| FR-AUTH-04 | AC-AUTH-09 | BO-01 |
| FR-WALLET-03 | AC-WALLET-04 | BO-02 |
| FR-TXN-02 | AC-TXN-03 | BO-02 |
| FR-DASH-02 | AC-DASH-07 | BO-02, BO-03 |
| SC-07 | NFR §8.2 | BO-05 |
| NFR-PERF-01 | NFR §8.1 LCP | BO-04 |
| SR-RLS-05 | NFR §8.2 | BO-05 |
| CR-01 | — | BRD §12.1 |
| CR-06 | — | BRD §12.3 |

---

*End of SRS v1.0.0 — CashIt*
