# Business Requirements Document (BRD)
## CashIt — Personal Expense Tracker Web Application

---

> **Document Control**

| Field | Details |
|---|---|
| **Document Title** | Business Requirements Document — CashIt |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Author** | Product & Business Analysis Team |
| **Date Created** | 2026-05-28 |
| **Last Reviewed** | 2026-05-28 |
| **Stakeholders** | Product, Engineering, Design, Marketing |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Problem Statement](#2-business-problem-statement)
3. [Business Objectives](#3-business-objectives)
4. [Success Metrics (KPIs)](#4-success-metrics-kpis)
5. [Market Analysis](#5-market-analysis)
6. [User Personas](#6-user-personas)
7. [Stakeholder Matrix](#7-stakeholder-matrix)
8. [High-Level Scope & Boundaries](#8-high-level-scope--boundaries)
9. [Assumptions & Dependencies](#9-assumptions--dependencies)
10. [Constraints](#10-constraints)
11. [Risk Register](#11-risk-register)
12. [Regulatory & Compliance Considerations](#12-regulatory--compliance-considerations)
13. [Glossary](#13-glossary)

---

## 1. Executive Summary

**CashIt** is a modern, web-based personal expense tracking application designed for individuals who demand clarity, speed, and aesthetic quality in managing their personal finances. Built around a **dark-mode-first design philosophy** with a mint-green and bright-blue accent system, CashIt targets students, freelancers, and young professionals who manage income and expenses across multiple payment methods — including physical cash and digital e-wallets such as DANA and GoPay.

The application's MVP will deliver a **frictionless authentication experience** via Google OAuth 2.0 (eliminating password fatigue), a **multi-wallet architecture** enabling users to track distinct balance pools, and **real-time dashboard analytics** powered by clean donut/pie chart visualizations.

CashIt enters a crowded market but differentiates through its **premium visual experience**, zero-configuration authentication, and mobile-first responsive web delivery — targeting a gap left by bloated mobile apps and enterprise-grade tools that feel like overkill for personal use.

---

## 2. Business Problem Statement

### 2.1 Core Problem

Individuals — particularly students and freelancers in emerging markets — struggle to maintain a consistent picture of their personal finances due to:

- **Fragmented payment methods**: Money is distributed across physical cash, bank accounts, and multiple e-wallets (DANA, GoPay, OVO, etc.), with no single unified view.
- **Friction in expense logging**: Existing apps require account creation with passwords, complex onboarding, or are desktop-only — creating drop-off before value is delivered.
- **Poor UX for the target demographic**: Most financial tools carry a sterile, corporate aesthetic that fails to resonate with younger digital-native users, leading to abandonment.
- **Lack of real-time feedback**: Delayed syncing and batch-update patterns mean users lose context between when a transaction occurs and when they see its impact on their balance.

### 2.2 Opportunity

There is a measurable opportunity to capture a segment of users who want a **lightweight, beautiful, and instantly usable** personal finance tool that respects their time, device preferences, and aesthetic sensibilities. The rise of e-wallet adoption across Southeast Asia creates a unique timing advantage for an app that natively understands the multi-wallet lifestyle.

---

## 3. Business Objectives

The following objectives are aligned to the MVP delivery horizon and are ordered by business priority.

| # | Objective | Priority | Target Horizon |
|---|---|---|---|
| BO-01 | Deliver a zero-friction onboarding experience via Google OAuth 2.0 with no manual password management | P0 — Critical | MVP |
| BO-02 | Enable users to track income and expenses across multiple, named wallets in real time | P0 — Critical | MVP |
| BO-03 | Provide actionable visual analytics (category-based donut/pie charts) to surface spending patterns | P1 — High | MVP |
| BO-04 | Establish a premium dark-mode-first brand identity that drives user retention and organic referral | P1 — High | MVP |
| BO-05 | Build a scalable data model that supports future integrations (bank APIs, export features, notifications) | P2 — Medium | Post-MVP |
| BO-06 | Achieve product-market fit within 3 months of public launch, validated through engagement metrics | P2 — Medium | Post-Launch |
| BO-07 | Explore monetization pathways (premium tiers, analytics exports) without compromising core UX | P3 — Low | Phase 2 |

---

## 4. Success Metrics (KPIs)

### 4.1 Acquisition Metrics

| Metric | Target (Month 1) | Target (Month 3) | Measurement Tool |
|---|---|---|---|
| Registered Users (via Google OAuth) | 500 | 3,000 | Auth Provider Analytics |
| Weekly Active Users (WAU) | 200 | 1,500 | Product Analytics |
| Onboarding Completion Rate | ≥ 85% | ≥ 90% | Funnel Analysis |
| Time-to-First-Transaction | < 2 minutes | < 90 seconds | Session Recording |

### 4.2 Engagement Metrics

| Metric | Target | Notes |
|---|---|---|
| Daily Transactions Logged per Active User | ≥ 2 | Indicator of habitual use |
| Average Session Duration | ≥ 4 minutes | Dashboard + transaction flow |
| D7 Retention Rate | ≥ 40% | Industry benchmark: 25–35% for finance apps |
| D30 Retention Rate | ≥ 20% | Strong indicator of stickiness |
| Wallets Created per User (avg.) | ≥ 2 | Validates multi-wallet feature value |

### 4.3 Product Quality Metrics

| Metric | Target | Notes |
|---|---|---|
| Page Load Time (LCP) | < 2.5 seconds | Core Web Vital benchmark |
| Dashboard Update Latency (post-transaction) | < 500ms | Real-time requirement |
| Crash / JS Error Rate | < 0.5% of sessions | Monitored via Sentry or equivalent |
| Accessibility Score (Lighthouse) | ≥ 85 | WCAG 2.1 AA compliance target |
| NPS (Net Promoter Score) | ≥ 40 | Surveyed at Day 30 post-registration |

### 4.4 Business Health Metrics (Post-MVP)

| Metric | Target (Month 6) | Notes |
|---|---|---|
| Monthly Active Users (MAU) | 10,000 | Organic + referral growth |
| Premium Conversion Rate | ≥ 5% of MAU | If freemium tier is introduced |
| Support Ticket Rate | < 2% of WAU | Low friction = low support burden |

---

## 5. Market Analysis

### 5.1 Target Market

- **Geography (Primary)**: Indonesia and Southeast Asia — regions with high e-wallet adoption (DANA, GoPay, OVO) and growing smartphone/internet penetration among young adults.
- **Geography (Secondary)**: Global English-speaking markets with similar demographic profiles (students, freelancers).
- **Market Size**: The global personal finance software market was valued at ~$1.3B in 2024, growing at ~6.2% CAGR. The SEA mobile wallet user base exceeded 400M active users in 2025.

### 5.2 Competitive Landscape

| Competitor | Strength | Weakness | CashIt Differentiator |
|---|---|---|---|
| **Mint** | Comprehensive, bank integrations | US-centric, cluttered UI, service discontinued | SEA-friendly, minimal UX, active product |
| **Money Manager** | Simple, widely adopted in Asia | Outdated UI, no web version, no OAuth | Premium dark UI, web-first, OAuth login |
| **Spendee** | Clean design, multi-currency | Core features paywalled, no e-wallet simulation | Free core tier, e-wallet balance tracking |
| **YNAB** | Powerful budgeting methodology | High learning curve, costly subscription | Zero learning curve, instant value delivery |
| **Spreadsheets** | Fully customizable, free | No UX, no analytics, high manual effort | Automated visuals, minimal data entry |

### 5.3 Positioning Statement

> *"For students and freelancers who manage money across multiple wallets and payment methods, CashIt is the personal expense tracker that delivers real-time financial clarity through a premium, dark-mode interface — with zero password setup and instant access via Google."*

---

## 6. User Personas

### Persona 1 — The College Student

| Attribute | Detail |
|---|---|
| **Name** | Rizky, 21 |
| **Role** | Full-time university student |
| **Location** | Bandung, Indonesia |
| **Income** | Monthly allowance (~IDR 1.5M) + occasional gig income |
| **Devices** | Android smartphone (primary), laptop (secondary) |
| **E-Wallets Used** | GoPay, DANA, Physical Cash |
| **Pain Points** | Loses track of where allowance goes; overspends on food and entertainment before month-end |
| **Goals** | Understand spending patterns; save toward a new laptop |
| **Motivations** | Aesthetic apps, speed, low friction |
| **Tech Comfort** | High — uses multiple apps daily |
| **Quote** | *"I want to know exactly where my money went without opening a spreadsheet."* |

---

### Persona 2 — The Freelance Designer

| Attribute | Detail |
|---|---|
| **Name** | Sari, 27 |
| **Role** | Independent graphic designer & social media consultant |
| **Location** | Jakarta, Indonesia |
| **Income** | Variable: IDR 5M–15M/month across multiple clients |
| **Devices** | MacBook Pro (primary), iPhone (secondary) |
| **E-Wallets Used** | DANA, Bank Transfer, Physical Cash |
| **Pain Points** | Irregular income; mixing personal and business expenses; no clear monthly profit picture |
| **Goals** | Separate business vs. personal expenses; maintain monthly cash flow awareness |
| **Motivations** | Professional-grade tools with aesthetic quality; efficiency over feature bloat |
| **Tech Comfort** | Very High — early adopter |
| **Quote** | *"I need something that looks as professional as my work portfolio but takes 10 seconds to log an expense."* |

---

### Persona 3 — The Young Professional

| Attribute | Detail |
|---|---|
| **Name** | Bima, 24 |
| **Role** | Junior software developer at a startup |
| **Location** | Surabaya, Indonesia |
| **Income** | Fixed salary: IDR 8M/month |
| **Devices** | Windows PC (work), Android (personal) |
| **E-Wallets Used** | GoPay, Physical Cash, Bank Transfer |
| **Pain Points** | Saving goals feel abstract; spending habits unclear until it's too late |
| **Goals** | Build a 3-month emergency fund; track daily habits (food, coffee, subscriptions) |
| **Motivations** | Data-driven decisions; clean dashboards; dark mode (developer culture alignment) |
| **Tech Comfort** | Expert |
| **Quote** | *"I trust data. Show me where I'm bleeding money and I'll fix it."* |

---

## 7. Stakeholder Matrix

| Stakeholder | Role | Interest Level | Influence Level | Engagement Strategy |
|---|---|---|---|---|
| **Product Owner** | Defines vision & prioritizes backlog | Very High | Very High | Daily alignment; RACI owner of PRD |
| **Engineering Lead** | Technical feasibility & delivery | High | High | Sprint planning; architecture reviews |
| **UI/UX Designer** | Design system & user flows | High | High | Design critiques; prototype sign-off |
| **QA Lead** | Testing & acceptance criteria validation | High | Medium | Criteria review in sprint grooming |
| **Marketing** | Launch strategy & user acquisition | Medium | Medium | Monthly GTM alignment |
| **End Users** | Adoption & feedback | Very High | Low | Beta program; in-app feedback widget |
| **Legal/Compliance** | Data privacy (GDPR/PDPA) | Medium | High | Policy review before public launch |

---

## 8. High-Level Scope & Boundaries

### 8.1 In Scope (MVP)

- Google OAuth 2.0 authentication (sign in & sign out)
- User profile display (Google avatar, display name, email)
- Multi-wallet creation, naming, and management (e.g., Cash, GoPay, DANA)
- Manual balance adjustment via income and expense transactions
- Transaction logging with: amount, category, wallet, date, and optional note
- Real-time dashboard: total balance, per-wallet balance, income vs. expense summary
- Expense category breakdown via donut/pie chart (dark-mode palette)
- Responsive web interface (mobile + desktop)
- Session persistence (stay logged in across page refreshes)

### 8.2 Out of Scope (MVP — Future Phases)

| Feature | Planned Phase |
|---|---|
| Bank account / API integration (Plaid, Tink, etc.) | Phase 2 |
| Push/email notifications (budget alerts, monthly summaries) | Phase 2 |
| Budget planning and savings goal-setting modules | Phase 2 |
| CSV/PDF export of transaction history | Phase 2 |
| Multi-currency support with live exchange rates | Phase 2 |
| Recurring transaction scheduling (subscriptions, rent) | Phase 2 |
| Mobile native apps (iOS / Android) | Phase 3 |
| Shared wallets / collaborative expense tracking | Phase 3 |
| Premium subscription tier / monetization | Phase 3 |

---

## 9. Assumptions & Dependencies

### 9.1 Assumptions

| ID | Assumption |
|---|---|
| A-01 | Users have an active Google account and are comfortable with OAuth-based login |
| A-02 | Target users have reliable internet access (web app is not offline-first for MVP) |
| A-03 | E-wallet balances (DANA, GoPay) will be entered **manually** by users in MVP — no third-party API |
| A-04 | The application will be hosted on a cloud platform (e.g., Vercel, Netlify, or Firebase Hosting) |
| A-05 | All monetary values in MVP will be stored in a single base currency (IDR default, user-configurable label) |
| A-06 | Backend data persistence will use a managed cloud database (e.g., Supabase / PostgreSQL) |

### 9.2 Dependencies

| ID | Dependency | Owner | Risk if Unavailable |
|---|---|---|---|
| D-01 | Google OAuth 2.0 API | Google Cloud | Authentication entirely blocked |
| D-02 | Cloud Database (Supabase or Firebase) | Engineering | Data persistence impossible |
| D-03 | Chart.js or equivalent visualization library | Engineering | Analytics features degraded |
| D-04 | CDN / Hosting Platform (Vercel / Netlify) | DevOps | App inaccessible to users |
| D-05 | Google Fonts (Inter / Outfit) | Design/CDN | Typography degraded (fallback fonts) |

---

## 10. Constraints

| Type | Constraint |
|---|---|
| **Technical** | MVP must be a web application (no native mobile app) |
| **Technical** | Authentication is exclusively via Google OAuth 2.0 — no email/password system |
| **Technical** | E-wallet balance tracking is manual simulation only — no third-party financial API for MVP |
| **Design** | All UI components must adhere to the dark-mode-first design system (`#111827` / `#0F141E` backgrounds) |
| **Design** | Primary accent: Mint Green `#76E8B6`; Secondary accent: Bright Blue `#4B96F3` |
| **Timeline** | MVP must be scoped to features achievable in a single engineering sprint cycle |
| **Budget** | MVP must use free or open-source libraries only (no paid SaaS charting or analytics tools) |
| **Privacy** | No raw financial credentials or bank credentials may ever be stored or transmitted |

---

## 11. Risk Register

| ID | Risk Description | Probability | Impact | Severity | Mitigation Strategy |
|---|---|---|---|---|---|
| R-01 | Google OAuth API changes disrupt authentication | Low | Critical | High | Monitor Google API changelog; abstract auth layer for provider flexibility |
| R-02 | Low retention due to manual data entry friction | Medium | High | High | Optimize transaction entry to < 5 taps; add quick-entry shortcuts |
| R-03 | Database cost escalation with rapid user growth | Medium | Medium | Medium | Leverage Supabase free tier; implement query optimization from day one |
| R-04 | Scope creep delaying MVP launch | High | High | Critical | Strict MVP feature freeze; maintain "parking lot" backlog for non-MVP items |
| R-05 | Poor mobile performance affecting target demographic | Medium | High | High | Mobile-first responsive design; Lighthouse audits pre-launch |
| R-06 | Competitor releases similar product during development | Low | Medium | Medium | Accelerate MVP delivery; focus on brand and UX differentiation |
| R-07 | GDPR/PDPA non-compliance creating legal exposure | Low | Critical | High | Privacy policy; data minimization; user data deletion capability (right to erasure) |
| R-08 | Chart library incompatibility with dark theme | Low | Medium | Low | Prototype charts in design system before full implementation |

---

## 12. Regulatory & Compliance Considerations

### 12.1 Data Privacy

- **GDPR (EU)**: If users from the EU access the app, data handling must comply. Requirements include: a published privacy policy, consent mechanism at registration, and the right to data deletion upon request.
- **PDPA (Indonesia)**: Indonesia's Personal Data Protection Act (UU PDP) requires lawful basis for data processing, explicit user consent, and breach notification obligations within 14 days.
- **Data Minimization Principle**: Only collect data strictly necessary for app functionality. Profile data (name, email, avatar) fetched from Google OAuth must not be stored beyond session needs.

### 12.2 OAuth & Security Standards

- Google OAuth tokens must be handled server-side or via a secure, HttpOnly cookie pattern — tokens must **never** be exposed in `localStorage`.
- Session tokens must have defined expiry and silent refresh logic.
- All data in transit must use HTTPS / TLS 1.2+.
- No financial data (balances, transactions) may be transmitted to third-party analytics services in identifiable form.

### 12.3 Financial Disclaimer

- CashIt is a **personal tracking tool only** and does not constitute financial advice, banking, investment guidance, or a regulated financial service.
- A clear legal disclaimer must be displayed in the app footer and during the onboarding flow.

---

## 13. Glossary

| Term | Definition |
|---|---|
| **BRD** | Business Requirements Document — defines the *why* and business-level *what* |
| **PRD** | Product Requirements Document — defines the feature-level *how* and *what* |
| **OAuth 2.0** | Open authorization protocol enabling third-party login without password sharing |
| **E-Wallet** | Digital payment wallet (e.g., DANA, GoPay, OVO) widely used in Southeast Asia |
| **Multi-Wallet Architecture** | Feature allowing users to create and manage multiple distinct balance pools |
| **MVP** | Minimum Viable Product — the smallest feature set that delivers core user value |
| **KPI** | Key Performance Indicator — a quantifiable measure of business or product success |
| **NPS** | Net Promoter Score — survey metric of user loyalty (scale: -100 to +100) |
| **LCP** | Largest Contentful Paint — Core Web Vital measuring perceived page load speed |
| **GDPR** | General Data Protection Regulation (European Union) |
| **PDPA** | Personal Data Protection Act (Indonesia — UU PDP) |
| **WAU / MAU / DAU** | Weekly / Monthly / Daily Active Users |
| **D7 / D30 Retention** | Percentage of users who return on Day 7 / Day 30 after their first session |
| **GTM** | Go-to-Market — strategy for launching a product to the target audience |

---

*End of BRD v1.0.0 — CashIt Personal Expense Tracker*
