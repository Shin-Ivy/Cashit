# Product Requirements Document (PRD)
## CashIt — Personal Expense Tracker Web Application

---

> **Document Control**

| Field | Details |
|---|---|
| **Document Title** | Product Requirements Document — CashIt |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Author** | Product Team |
| **Date Created** | 2026-05-28 |
| **Related BRD** | `BRD.md` v1.0.0 |

---

## Table of Contents

1. [Product Vision & Goals](#1-product-vision--goals)
2. [Design System Specification](#2-design-system-specification)
3. [Feature 1 — Authentication](#3-feature-1--authentication)
4. [Feature 2 — Multi-Wallet Management](#4-feature-2--multi-wallet-management)
5. [Feature 3 — Transaction Logging](#5-feature-3--transaction-logging)
6. [Feature 4 — Real-Time Dashboard](#6-feature-4--real-time-dashboard)
7. [Feature 5 — Visual Analytics](#7-feature-5--visual-analytics)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Information Architecture & User Flows](#9-information-architecture--user-flows)
10. [Release Criteria](#10-release-criteria)
11. [Open Questions & Decisions Log](#11-open-questions--decisions-log)

---

## 1. Product Vision & Goals

### 1.1 Vision Statement

> *CashIt is the fastest, most beautiful way for students and freelancers to see exactly where their money is — across every wallet they own — in real time.*

### 1.2 MVP Goals

| Goal | Measurable Outcome |
|---|---|
| Zero-friction sign-in | User authenticated in < 30 seconds via Google OAuth |
| Multi-wallet awareness | User can create ≥ 3 wallets and see individual balances |
| Instant transaction feedback | Dashboard updates within 500ms of saving a transaction |
| Visual spending clarity | Category donut chart renders with < 5 data points on first use |
| Aesthetic differentiation | Dark-mode UI scores ≥ 85 on Lighthouse accessibility |

### 1.3 Out of Scope for v1.0

Bank API integrations, push notifications, budget goals, CSV export, recurring transactions, native mobile apps, multi-currency live rates, shared wallets, and any premium/paid tier features.

---

## 2. Design System Specification

### 2.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0F141E` | Page/app background |
| `--bg-secondary` | `#111827` | Cards, panels, modals |
| `--bg-elevated` | `#1A2236` | Hover states, input fields |
| `--accent-mint` | `#76E8B6` | Primary CTA buttons, positive balances, income amounts, logo "C" |
| `--accent-blue` | `#4B96F3` | Informational elements, links, secondary actions, logo "i" |
| `--accent-red` | `#F87171` | Expense amounts, negative deltas, destructive actions |
| `--text-primary` | `#F1F5F9` | Headings, primary body text |
| `--text-secondary` | `#94A3B8` | Subtitles, labels, placeholder text |
| `--border` | `#1E2D40` | Card borders, dividers |

### 2.2 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Brand | Inter | 800 | 2rem+ |
| Headings | Inter | 700 | 1.25–1.75rem |
| Body | Inter | 400 | 0.875–1rem |
| Mono / Amounts | JetBrains Mono | 500 | 1–1.5rem |

### 2.3 Component Standards

- **Border radius**: `0.75rem` (cards), `0.5rem` (inputs/buttons), `9999px` (pills/tags)
- **Shadow**: `0 4px 24px rgba(0,0,0,0.4)` on elevated cards
- **Transitions**: `200ms ease` on all interactive states
- **Glassmorphism** (selective): `backdrop-filter: blur(12px)` on overlapping modals/drawers
- **Focus rings**: `2px solid #76E8B6` — visible for keyboard accessibility

### 2.4 Chart Palette (Donut/Pie)

Category colors must maintain contrast on `#0F141E` background:

| Category | Color |
|---|---|
| Food & Drink | `#76E8B6` (mint) |
| Transport | `#4B96F3` (blue) |
| Shopping | `#A78BFA` (purple) |
| Entertainment | `#FB923C` (orange) |
| Health | `#34D399` (emerald) |
| Bills & Utilities | `#F472B6` (pink) |
| Other | `#94A3B8` (slate) |

---

## 3. Feature 1 — Authentication

### 3.1 Overview

CashIt uses **Google OAuth 2.0 exclusively**. No email/password registration. No manual credential storage. Users click "Continue with Google", complete the Google consent flow, and land directly on their dashboard.

### 3.2 User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-AUTH-01 | New visitor | Sign in with my Google account in one click | I can start tracking without creating a new password |
| US-AUTH-02 | Returning user | Be automatically signed back in on revisit | I don't have to authenticate every session |
| US-AUTH-03 | Signed-in user | Sign out securely | My financial data is protected on shared devices |
| US-AUTH-04 | Any user | See my Google profile picture and name in the app | I know which account I'm using |

### 3.3 Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-AUTH-01 | A "Continue with Google" button is the **only** authentication entry point on the landing page |
| AC-AUTH-02 | Clicking the button triggers Google's OAuth 2.0 consent screen |
| AC-AUTH-03 | On successful auth, user is redirected to the dashboard within 2 seconds |
| AC-AUTH-04 | Auth token is stored in a secure HttpOnly cookie or server-side session — **never in localStorage** |
| AC-AUTH-05 | Session persists across page refreshes without re-authentication for up to 7 days |
| AC-AUTH-06 | Clicking "Sign Out" clears the session token and redirects to the landing/login page |
| AC-AUTH-07 | User's Google display name, email, and avatar URL are stored in the user profile record |
| AC-AUTH-08 | If OAuth flow fails or is cancelled, user sees a friendly error message and can retry |
| AC-AUTH-09 | Unauthenticated users attempting to access `/dashboard` or any protected route are redirected to login |

### 3.4 UI Specifications

- **Landing Page**: Full-viewport dark background (`#0F141E`), centered CashIt logo, tagline, and a single mint-green "Continue with Google" button with Google's official logo icon.
- **Loading state**: Spinner overlay during OAuth redirect; no blank white flash.
- **Error state**: Inline error card (dark card, red border) with retry button.
- **Profile chip**: Top-right nav shows circular Google avatar + display name; clicking opens a dropdown with "Sign Out".

---

## 4. Feature 2 — Multi-Wallet Management

### 4.1 Overview

Each user can create multiple named wallets representing distinct money pools (e.g., "Physical Cash", "GoPay", "DANA", "Savings Jar"). Balances are calculated dynamically from all transactions assigned to that wallet. Users can edit wallet names and delete empty wallets.

### 4.2 User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-WALLET-01 | New user | Create my first wallet with a custom name and icon | I can start categorizing my money pools |
| US-WALLET-02 | User with multiple e-wallets | Create separate wallets for GoPay, DANA, and Cash | I can track each payment method independently |
| US-WALLET-03 | Any user | See all my wallets and their current balances at a glance | I know exactly how much is in each place |
| US-WALLET-04 | Any user | Edit a wallet's name or icon | I can correct mistakes or rename it |
| US-WALLET-05 | Any user | Delete a wallet that I no longer use | My wallet list stays clean and relevant |

### 4.3 Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-WALLET-01 | New user is prompted to create their first wallet during onboarding |
| AC-WALLET-02 | User can create up to **10 wallets** in MVP; creation is blocked with an explanatory message beyond this limit |
| AC-WALLET-03 | Wallet requires a name (3–30 characters); an emoji icon is optional (defaults to 💵) |
| AC-WALLET-04 | Wallet balance is the **sum of all income transactions minus all expense transactions** assigned to it |
| AC-WALLET-05 | Wallet balance updates in real time upon any transaction being saved or deleted |
| AC-WALLET-06 | Wallet deletion is only permitted if the wallet has **zero transactions**; otherwise user sees a warning |
| AC-WALLET-07 | A wallet cannot be renamed to an empty string; duplicate names trigger a validation error |
| AC-WALLET-08 | Each wallet card displays: name, icon, current balance (colored mint if positive, red if negative), and transaction count |

### 4.4 Data Model

```
Wallet {
  id:          UUID (PK)
  user_id:     UUID (FK → Users)
  name:        String (3–30 chars)
  icon:        String (emoji, default: "💵")
  created_at:  Timestamp
  updated_at:  Timestamp
}
```

### 4.5 UI Specifications

- **Wallet Cards**: Horizontally scrollable row on dashboard; each card is a dark glass panel with name, icon, and balance.
- **Add Wallet**: Floating "+" button or "Add Wallet" card at end of row; opens a bottom sheet/modal.
- **Wallet Detail**: Clicking a wallet card filters the transaction list to show only that wallet's history.
- **Edit/Delete**: Long-press on mobile or three-dot menu on desktop exposes Edit and Delete options.

---

## 5. Feature 3 — Transaction Logging

### 5.1 Overview

The core data-entry experience. Users log income or expense transactions, assigning each to a wallet and category. The entry form must be completable in under 10 seconds for a repeat user.

### 5.2 User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-TXN-01 | Any user | Log an expense with amount, category, wallet, and date | My spending is tracked against the correct wallet |
| US-TXN-02 | Any user | Log an income transaction | My wallet balance increases correctly |
| US-TXN-03 | Any user | Add an optional note to a transaction | I can remember context (e.g., "lunch with client") |
| US-TXN-04 | Any user | Edit a transaction I made | I can correct errors without deleting and re-entering |
| US-TXN-05 | Any user | Delete a transaction | I can remove duplicates or mistakes |
| US-TXN-06 | Any user | See a chronological list of all transactions | I can review my spending history |
| US-TXN-07 | Any user | Filter transactions by wallet, category, or date range | I can find specific records quickly |

### 5.3 Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-TXN-01 | Transaction form requires: Type (Income/Expense), Amount (> 0), Category, Wallet, Date |
| AC-TXN-02 | Note field is optional, max 120 characters |
| AC-TXN-03 | Amount field accepts only positive numeric input; decimal support with 2 places |
| AC-TXN-04 | Date defaults to today's date; user can select any past or current date (future dates blocked) |
| AC-TXN-05 | On save, wallet balance and dashboard summary update within 500ms |
| AC-TXN-06 | Editing a transaction pre-fills the form with existing values |
| AC-TXN-07 | Deleting a transaction shows a confirmation dialog before permanent removal |
| AC-TXN-08 | Transaction list is paginated or virtualized at 50 items per page |
| AC-TXN-09 | Filter persists within the session but resets on page reload |
| AC-TXN-10 | Empty states (no transactions yet) display a friendly illustration and call-to-action |

### 5.4 Expense Categories (MVP)

`Food & Drink` · `Transport` · `Shopping` · `Entertainment` · `Health` · `Bills & Utilities` · `Education` · `Personal Care` · `Travel` · `Other`

### 5.5 Data Model

```
Transaction {
  id:           UUID (PK)
  user_id:      UUID (FK → Users)
  wallet_id:    UUID (FK → Wallets)
  type:         ENUM('income', 'expense')
  amount:       DECIMAL(15, 2)
  category:     String
  note:         String (nullable, max 120)
  date:         Date
  created_at:   Timestamp
  updated_at:   Timestamp
}
```

### 5.6 UI Specifications

- **Add Transaction FAB**: Persistent floating action button (mint-green, bottom-right) — always accessible.
- **Transaction Form**: Slides up as a bottom sheet (mobile) or centered modal (desktop).
- **Type Toggle**: Pill toggle "Expense | Income" at top of form; active state uses accent color.
- **Category Picker**: Grid of icon+label tiles inside the form; scrollable.
- **Transaction Row**: Shows category icon, name/note, wallet tag, date, and amount (red for expense, mint for income).

---

## 6. Feature 4 — Real-Time Dashboard

### 6.1 Overview

The dashboard is the app's home screen — a comprehensive, always-up-to-date financial snapshot. It renders immediately on login and updates reactively whenever transactions or wallets change.

### 6.2 User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-DASH-01 | Any user | See my total balance across all wallets | I know my overall financial position at a glance |
| US-DASH-02 | Any user | See income vs. expense totals for the current month | I can track my monthly cash flow |
| US-DASH-03 | Any user | See each wallet's individual balance | I know what's in each payment method |
| US-DASH-04 | Any user | See my most recent transactions | I can quickly review recent activity |
| US-DASH-05 | Any user | Have all figures update immediately after a transaction | I don't need to refresh the page |

### 6.3 Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-DASH-01 | Dashboard displays Total Balance (sum of all wallet balances) in large, prominent typography |
| AC-DASH-02 | Total Balance uses `--accent-mint` color if ≥ 0, `--accent-red` if negative |
| AC-DASH-03 | Monthly Income and Monthly Expense summary cards are displayed side by side |
| AC-DASH-04 | "This Month" is the default period; user can toggle to "Last 7 Days", "Last 30 Days", "All Time" |
| AC-DASH-05 | Wallet cards row renders all user wallets with individual balances |
| AC-DASH-06 | Recent Transactions section shows the last 10 transactions (all wallets) |
| AC-DASH-07 | All dashboard figures update within 500ms of a transaction being saved, edited, or deleted |
| AC-DASH-08 | Dashboard renders an onboarding prompt (create first wallet) if user has zero wallets |
| AC-DASH-09 | Dashboard is fully usable on screens ≥ 320px width |

---

## 7. Feature 5 — Visual Analytics

### 7.1 Overview

A dedicated Analytics view (or dashboard section) renders donut/pie charts breaking down expenses by category. Charts use the CashIt dark-mode chart palette and are interactive (hover/tap for details).

### 7.2 User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-ANALYTICS-01 | Any user | See a donut chart of my spending by category | I can immediately identify where most money goes |
| US-ANALYTICS-02 | Any user | Filter the chart by time period | I can compare current vs. past spending patterns |
| US-ANALYTICS-03 | Any user | Hover/tap a chart segment for exact amount and percentage | I get precise figures without reading a table |
| US-ANALYTICS-04 | Any user | Filter analytics by a specific wallet | I can analyze spending from one payment method |

### 7.3 Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-ANA-01 | Expense category donut chart renders using Chart.js (or equivalent OSS library) |
| AC-ANA-02 | Chart uses the defined category color palette on `#0F141E` background |
| AC-ANA-03 | Center of donut displays total expense amount for selected period |
| AC-ANA-04 | Legend below/beside chart lists each category, its color swatch, amount, and percentage |
| AC-ANA-05 | Hover/tap on segment shows tooltip: category name, amount, percentage |
| AC-ANA-06 | Time period filter options: This Month, Last 7 Days, Last 30 Days, All Time |
| AC-ANA-07 | If no expense data exists for selected period, chart is hidden and replaced with an empty state message |
| AC-ANA-08 | Chart is responsive and renders correctly on mobile (min width 280px) |
| AC-ANA-09 | A secondary bar or line chart shows income vs. expense trend over the selected period |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Requirement | Target |
|---|---|
| Initial page load (LCP) | < 2.5 seconds on 4G mobile |
| Dashboard data fetch | < 1 second |
| Transaction save → UI update | < 500ms |
| Chart render time | < 300ms after data is available |
| Bundle size (gzipped JS) | < 200KB |

### 8.2 Security

| Requirement | Detail |
|---|---|
| Transport security | All traffic over HTTPS / TLS 1.2+ |
| Auth token storage | HttpOnly secure cookie or server-side session only |
| Data isolation | All DB queries scoped by `user_id`; RLS (Row Level Security) enforced at DB layer |
| Input sanitization | All user inputs sanitized before DB writes; no raw SQL string interpolation |
| OAuth scope | Request minimum Google scopes: `openid`, `email`, `profile` — no Drive, Calendar, or Gmail |

### 8.3 Reliability & Availability

| Requirement | Target |
|---|---|
| Uptime SLA | ≥ 99.5% (leveraging hosting platform SLA) |
| Data durability | ≥ 99.99% (managed cloud DB with daily backups) |
| Error rate | < 0.5% of API requests result in 5xx errors |

### 8.4 Accessibility

| Requirement | Standard |
|---|---|
| WCAG compliance | Level AA (WCAG 2.1) |
| Keyboard navigation | All interactive elements reachable and operable via keyboard |
| Color contrast | ≥ 4.5:1 for normal text; ≥ 3:1 for large text and UI components |
| Screen reader support | Semantic HTML; ARIA labels on icon-only buttons and chart elements |
| Focus indicators | Visible `2px solid #76E8B6` ring on all focusable elements |

### 8.5 Browser & Device Support

| Target | Support Level |
|---|---|
| Chrome (latest 2 versions) | Full support |
| Firefox (latest 2 versions) | Full support |
| Safari (latest 2 versions) | Full support |
| Edge (latest 2 versions) | Full support |
| Mobile Chrome / Safari | Full support (primary target) |
| IE 11 | Not supported |

---

## 9. Information Architecture & User Flows

### 9.1 Site Map

```
/ (Landing / Login)
└── /dashboard (Protected)
    ├── /wallets
    │   ├── /wallets/new
    │   └── /wallets/:id
    ├── /transactions
    │   ├── /transactions/new
    │   └── /transactions/:id/edit
    ├── /analytics
    └── /profile
```

### 9.2 Critical User Flow — First-Time User

```
1. Visit CashIt URL
2. See Landing Page → Click "Continue with Google"
3. Complete Google OAuth consent
4. Redirected to Onboarding prompt: "Create your first wallet"
5. Enter wallet name + pick icon → Save
6. Land on Dashboard (empty state — no transactions)
7. Click FAB → Add first transaction
8. Fill form → Save
9. Dashboard updates in real time — first value visible ✅
```

### 9.3 Critical User Flow — Returning User

```
1. Visit CashIt URL
2. Auto-redirected to Dashboard (session active)
   OR re-authenticate via Google (session expired)
3. Review dashboard summary
4. Click FAB → Log new transaction
5. View updated balances and charts
```

---

## 10. Release Criteria

### 10.1 MVP Launch Checklist

All items below must be verified before public v1.0 release:

| # | Criterion | Owner | Status |
|---|---|---|---|
| RC-01 | Google OAuth sign-in and sign-out working in production | Engineering | ⬜ |
| RC-02 | Multi-wallet CRUD fully functional | Engineering | ⬜ |
| RC-03 | Transaction CRUD (create, read, update, delete) fully functional | Engineering | ⬜ |
| RC-04 | Dashboard real-time updates confirmed (< 500ms) | Engineering + QA | ⬜ |
| RC-05 | Analytics donut chart renders correctly on all supported browsers | Engineering + QA | ⬜ |
| RC-06 | All pages are responsive and usable at 320px min width | Design + QA | ⬜ |
| RC-07 | Lighthouse Performance score ≥ 80 on mobile | Engineering | ⬜ |
| RC-08 | Lighthouse Accessibility score ≥ 85 | Engineering | ⬜ |
| RC-09 | Privacy policy page published and linked in footer | Legal + Product | ⬜ |
| RC-10 | Financial disclaimer displayed in onboarding and footer | Legal + Product | ⬜ |
| RC-11 | User data deletion capability implemented (GDPR/PDPA) | Engineering | ⬜ |
| RC-12 | All critical user flows pass QA regression | QA | ⬜ |
| RC-13 | No open P0 or P1 bugs | QA | ⬜ |
| RC-14 | Error monitoring (Sentry or equivalent) configured | Engineering | ⬜ |

### 10.2 Bug Severity Definitions

| Severity | Definition | Max Resolution Time |
|---|---|---|
| **P0 — Critical** | App unusable; auth broken; data loss | Block release; fix immediately |
| **P1 — High** | Core feature broken; major UX failure | Fix before release |
| **P2 — Medium** | Feature degraded; workaround exists | Fix in next sprint |
| **P3 — Low** | Minor visual defect; edge-case issue | Fix in backlog |

---

## 11. Open Questions & Decisions Log

| ID | Question | Status | Owner | Resolution |
|---|---|---|---|---|
| OQ-01 | Which backend platform: Supabase vs. Firebase vs. custom Node.js? | Open | Engineering Lead | — |
| OQ-02 | Should wallet balance support manual "set balance" override, or always derive from transactions? | Open | Product | Recommendation: derive from transactions for accuracy |
| OQ-03 | What is the default currency display format for IDR? (Rp 10.000 vs IDR 10,000) | Open | Design + Product | — |
| OQ-04 | Is there a maximum transaction amount to prevent data entry errors? | Open | Engineering | Recommendation: soft cap at 9,999,999,999 |
| OQ-05 | Should the Analytics view be a separate page or a dashboard section/tab? | Open | Design | — |
| OQ-06 | What Google OAuth library to use? (Firebase Auth, Supabase Auth, NextAuth, or raw OAuth) | Open | Engineering Lead | — |

---

*End of PRD v1.0.0 — CashIt Personal Expense Tracker*
