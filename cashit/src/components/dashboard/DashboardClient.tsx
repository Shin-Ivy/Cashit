"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Wallet,
  Banknote,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Link2,
  Eye,
  EyeOff,
  BarChart3,
  Receipt,
} from "lucide-react";
import { formatIDR } from "@/lib/formatters";
import LinkEWalletModal from "@/components/dashboard/LinkEWalletModal";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";

/* ─── Placeholder Data Types ──────────────────────────────────────────────── */

interface LinkedWallet {
  readonly provider: string;
  readonly phone: string;
  readonly balance: number;
}

interface Transaction {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly type: "income" | "expense";
  readonly category: string;
  readonly date: string;
}

/* ─── Empty State Component ───────────────────────────────────────────────── */

function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly subtitle: string;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-10 lg:py-14 px-6">
      {/* Glowing icon container */}
      <div className="relative mb-5">
        <div
          aria-hidden="true"
          className="absolute inset-0 w-16 h-16 bg-mint/10 rounded-full blur-xl animate-pulse"
        />
        <div className="relative w-16 h-16 rounded-2xl bg-surface-2 border border-border/50 flex items-center justify-center">
          <Icon className="w-7 h-7 text-muted" />
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-100 text-center mb-1.5">
        {title}
      </p>
      <p className="text-xs text-gray-400 text-center max-w-[240px] leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

/* ─── Mini Bar Chart (Income vs Expense) ──────────────────────────────────── */

function EmptyChartState(): React.JSX.Element {
  // Decorative placeholder bars for the empty chart
  const PLACEHOLDER_BARS = [30, 55, 20, 65, 40, 25, 45];
  return (
    <div className="flex flex-col items-center">
      {/* Faded decorative chart */}
      <div className="flex items-end gap-1.5 lg:gap-3 h-24 lg:h-40 w-full opacity-20 mb-4">
        {PLACEHOLDER_BARS.map((height, i) => (
          <div
            key={`placeholder-${i}`}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <div className="flex gap-px lg:gap-0.5 w-full h-20 lg:h-36 items-end justify-center">
              <div
                className="w-[45%] bg-mint/40 rounded-t-sm lg:rounded-t"
                style={{ height: `${height}%` }}
              />
              <div
                className="w-[45%] bg-expense/40 rounded-t-sm lg:rounded-t"
                style={{ height: `${Math.max(height - 15, 10)}%` }}
              />
            </div>
            <span className="text-[9px] lg:text-xs text-muted font-medium">
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </span>
          </div>
        ))}
      </div>
      <EmptyState
        icon={BarChart3}
        title="No data to visualize"
        subtitle="Your income vs expense chart will appear here once you start adding transactions."
      />
    </div>
  );
}

function MiniBarChart({
  transactions,
}: {
  readonly transactions: readonly Transaction[];
}): React.JSX.Element {
  // Build chart data from transactions — group by day of week
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = dayLabels.map((label) => ({
    label,
    income: 0,
    expense: 0,
  }));

  for (const txn of transactions) {
    const d = new Date(txn.date);
    const dayIndex = (d.getDay() + 6) % 7; // Monday = 0
    if (txn.type === "income") {
      chartData[dayIndex].income += txn.amount;
    } else {
      chartData[dayIndex].expense += txn.amount;
    }
  }

  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.income, d.expense)),
    1
  );

  return (
    <div className="flex items-end gap-1.5 lg:gap-3 h-24 lg:h-40 w-full">
      {chartData.map((day) => (
        <div
          key={day.label}
          className="flex-1 flex flex-col items-center gap-0.5"
        >
          <div className="flex gap-px lg:gap-0.5 w-full h-20 lg:h-36 items-end justify-center">
            {/* Income bar */}
            <div
              className="w-[45%] bg-mint/70 rounded-t-sm lg:rounded-t transition-all duration-500 min-h-[2px]"
              style={{
                height: `${Math.max((day.income / maxValue) * 100, 3)}%`,
              }}
            />
            {/* Expense bar */}
            <div
              className="w-[45%] bg-expense/70 rounded-t-sm lg:rounded-t transition-all duration-500 min-h-[2px]"
              style={{
                height: `${Math.max((day.expense / maxValue) * 100, 3)}%`,
              }}
            />
          </div>
          <span className="text-[9px] lg:text-xs text-muted font-medium">
            {day.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Dashboard Client ────────────────────────────────────────────────────── */

export default function DashboardClient(): React.JSX.Element {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userImage = session?.user?.image ?? null;

  // Wallet balances — default to zero for new users
  const [cashBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);

  // E-Wallet linking
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkedWallets, setLinkedWallets] = useState<LinkedWallet[]>([]);

  // Add Transaction modal
  const [isAddTxnModalOpen, setIsAddTxnModalOpen] = useState(false);

  // Transactions — empty by default (no mock data)
  const [transactions] = useState<readonly Transaction[]>([]);

  const totalLinkedBalance = linkedWallets.reduce((s, w) => s + w.balance, 0);
  const netBalance = cashBalance + totalLinkedBalance;
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const handleLinkWallet = useCallback((wallet: LinkedWallet): void => {
    setLinkedWallets((prev) => [...prev, wallet]);
  }, []);

  const displayAmount = (amount: number): string =>
    showBalance ? formatIDR(amount) : "Rp ••••••";

  const hasTransactions = transactions.length > 0;

  return (
    <div className="min-h-screen bg-base pb-24 lg:pb-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-base/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg lg:max-w-none mx-auto flex items-center justify-between px-5 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {userImage !== null ? (
              <Image
                src={userImage}
                alt={userName}
                width={36}
                height={36}
                className="rounded-full border border-border lg:hidden"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center lg:hidden">
                <span className="text-sm font-bold text-mint">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-[11px] text-muted leading-none">Welcome back,</p>
              <p className="text-sm font-semibold text-on-base leading-tight">
                {userName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowBalance((v) => !v)}
              aria-label={showBalance ? "Hide balances" : "Show balances"}
              className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-on-base transition-colors"
            >
              {showBalance ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Grid ──────────────────────────────────────────── */}
      <div className="max-w-lg lg:max-w-none mx-auto px-5 lg:px-8 py-5 flex flex-col gap-5">

        {/* Desktop: 3-column grid layout | Mobile: stacked vertical */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">

          {/* ════════════════════════════════════════════════════════════════
              COLUMN 1 (Desktop): Net Balance + Wallets + Link E-Wallet
              On mobile this renders as stacked cards in order
              ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5 lg:col-span-1">

            {/* ── Net Balance Card ──────────────────────────────────────── */}
            <section className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-5 shadow-card relative overflow-hidden">
              {/* Decorative gradient orb */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 w-32 h-32 bg-mint/8 rounded-full blur-3xl"
              />
              <div className="relative z-10">
                <p className="text-xs text-muted font-medium flex items-center gap-1.5 mb-1">
                  <Wallet className="w-3.5 h-3.5" />
                  Net Balance
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-on-base tracking-tight mb-3">
                  {displayAmount(netBalance)}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-mint/10 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-mint" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted leading-none">Income</p>
                      <p className="text-xs font-semibold text-mint leading-tight">
                        {displayAmount(totalIncome)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-expense/10 flex items-center justify-center">
                      <TrendingDown className="w-3.5 h-3.5 text-expense" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted leading-none">Expenses</p>
                      <p className="text-xs font-semibold text-expense leading-tight">
                        {displayAmount(totalExpense)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Multi-Wallet Section ─────────────────────────────────── */}
            <section>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Wallets
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {/* Physical Balance (Cash) */}
                <div className="bg-surface border border-border rounded-2xl p-4 shadow-card group hover:border-mint/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-mint/10 flex items-center justify-center">
                        <Banknote className="w-4.5 h-4.5 text-mint" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-on-base leading-none">
                          Cash
                        </p>
                        <p className="text-[10px] text-muted leading-tight mt-0.5">
                          Physical Balance
                        </p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                  </div>
                  <p className="text-lg font-bold text-on-base">
                    {displayAmount(cashBalance)}
                  </p>
                </div>

                {/* Non-Physical Balance (Bank) — Not Linked State */}
                <button
                  type="button"
                  aria-label="Setup bank account"
                  className="bg-surface border border-border rounded-2xl p-4 shadow-card group hover:border-blue/30 transition-all text-left w-full cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center">
                        <CreditCard className="w-4.5 h-4.5 text-blue" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-on-base leading-none">
                          Bank Account
                        </p>
                        <p className="text-[10px] text-muted leading-tight mt-0.5">
                          Digital Balance
                        </p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-muted/50" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">
                    Not Linked Yet
                  </p>
                  <p className="text-[10px] text-blue font-medium mt-1 group-hover:underline transition-all">
                    Click to setup
                  </p>
                </button>

                {/* Linked E-Wallets */}
                {linkedWallets.map((ew, idx) => (
                  <div
                    key={`${ew.provider}-${idx}`}
                    className="bg-surface border border-border rounded-2xl p-4 shadow-card group hover:border-mint/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-mint/10 flex items-center justify-center">
                          <Smartphone className="w-4.5 h-4.5 text-mint" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-on-base leading-none">
                            {ew.provider}
                          </p>
                          <p className="text-[10px] text-muted leading-tight mt-0.5">
                            {ew.phone}
                          </p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-mint" />
                    </div>
                    <p className="text-lg font-bold text-on-base">
                      {displayAmount(ew.balance)}
                    </p>
                  </div>
                ))}

                {/* E-Wallet — Not Linked State (shown when no e-wallets linked) */}
                {linkedWallets.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsLinkModalOpen(true)}
                    aria-label="Setup e-wallet"
                    className="bg-surface border border-border rounded-2xl p-4 shadow-card group hover:border-mint/30 transition-all text-left w-full cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-mint/10 flex items-center justify-center">
                          <Smartphone className="w-4.5 h-4.5 text-mint" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-on-base leading-none">
                            E-Wallet
                          </p>
                          <p className="text-[10px] text-muted leading-tight mt-0.5">
                            GoPay, OVO, DANA
                          </p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-muted/50" />
                    </div>
                    <p className="text-sm font-semibold text-gray-400">
                      Not Linked Yet
                    </p>
                    <p className="text-[10px] text-mint font-medium mt-1 group-hover:underline transition-all">
                      Click to setup
                    </p>
                  </button>
                )}

                {/* Link E-Wallet CTA */}
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(true)}
                  className="bg-surface-2/50 border border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-blue/50 hover:bg-surface-2 transition-all group min-h-[120px]"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Link2 className="w-4 h-4 text-blue" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-on-base">
                      Link E-Wallet
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">
                      Connect GoPay, OVO, DANA
                    </p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              COLUMNS 2 & 3 (Desktop): Analytics Chart + Recent Transactions
              On mobile these stack below the wallets
              ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5 lg:col-span-2">

            {/* ── Income vs Expenses Chart ─────────────────────────────── */}
            <section className="bg-surface border border-border rounded-2xl p-4 lg:p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs lg:text-sm font-semibold text-gray-100">
                  Income vs Expenses
                </h3>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-mint/70" />
                    <span className="text-[9px] lg:text-xs text-gray-400">Income</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-expense/70" />
                    <span className="text-[9px] lg:text-xs text-gray-400">Expense</span>
                  </span>
                </div>
              </div>
              {hasTransactions ? (
                <MiniBarChart transactions={transactions} />
              ) : (
                <EmptyChartState />
              )}
            </section>

            {/* ── Recent Transactions ──────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Recent Transactions
                </h3>
                {hasTransactions && (
                  <button
                    type="button"
                    className="text-[10px] lg:text-xs text-blue font-medium hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>
              <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
                {hasTransactions ? (
                  <div className="divide-y divide-border/50">
                    {transactions.map((txn) => (
                      <div
                        key={txn.id}
                        className="flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-4 hover:bg-surface-2/50 transition-colors"
                      >
                        <div
                          className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            txn.type === "income"
                              ? "bg-mint/10"
                              : "bg-expense/10"
                          }`}
                        >
                          {txn.type === "income" ? (
                            <ArrowDownLeft className="w-4 h-4 lg:w-5 lg:h-5 text-mint" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 text-expense" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm lg:text-base font-medium text-gray-100 truncate">
                            {txn.description}
                          </p>
                          <p className="text-[10px] lg:text-xs text-gray-400">
                            {txn.category}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p
                            className={`text-sm lg:text-base font-semibold ${
                              txn.type === "income" ? "text-mint" : "text-expense"
                            }`}
                          >
                            {txn.type === "income" ? "+" : "-"}
                            {formatIDR(txn.amount)}
                          </p>
                          <p className="text-[9px] lg:text-[11px] text-gray-400">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                            }).format(new Date(txn.date))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Receipt}
                    title="No transactions yet"
                    subtitle="Click the + button to start tracking your finances. Your recent activity will appear here."
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ── Quick Actions FAB ────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsAddTxnModalOpen(true)}
        aria-label="Add new transaction"
        className="fixed bottom-24 right-5 sm:right-[calc(50%-14rem)] lg:bottom-8 lg:right-8 z-40 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-mint to-blue rounded-full shadow-glow-mint flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-base" />
      </button>

      {/* ── E-Wallet Link Modal ──────────────────────────────────────── */}
      <LinkEWalletModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onLink={handleLinkWallet}
      />

      {/* ── Add Transaction Modal ────────────────────────────────────── */}
      <AddTransactionModal
        isOpen={isAddTxnModalOpen}
        onClose={() => setIsAddTxnModalOpen(false)}
      />
    </div>
  );
}
