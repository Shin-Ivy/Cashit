"use client";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Banknote,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Smartphone,
  BarChart3,
} from "lucide-react";

export default function DashboardPreview(): React.JSX.Element {
  return (
    <div className="w-full max-w-lg lg:max-w-none mx-auto flex flex-col gap-4 px-4 lg:px-0">
      {/* Net Balance Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-card relative overflow-hidden">
        <div aria-hidden="true" className="absolute -top-10 -right-10 w-28 h-28 bg-mint/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-xs text-muted font-medium flex items-center gap-1.5 mb-1">
            <Wallet className="w-3.5 h-3.5" /> Net Balance
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-on-base tracking-tight mb-3">Rp 18.150.000</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-mint/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-mint" />
              </div>
              <div>
                <p className="text-[10px] text-muted leading-none">Income</p>
                <p className="text-xs font-semibold text-mint">Rp 16.500.000</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-expense/10 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5 text-expense" />
              </div>
              <div>
                <p className="text-[10px] text-muted leading-none">Expenses</p>
                <p className="text-xs font-semibold text-expense">Rp 463.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: 2-column grid for wallets + chart | Mobile: stacked */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        {/* Wallet Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-mint/10 flex items-center justify-center">
                <Banknote className="w-4 h-4 text-mint" />
              </div>
              <div>
                <p className="text-[10px] text-muted">Cash</p>
                <p className="text-xs font-semibold text-on-base">Physical</p>
              </div>
            </div>
            <p className="text-base font-bold text-on-base">Rp 2.750.000</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue" />
              </div>
              <div>
                <p className="text-[10px] text-muted">Bank</p>
                <p className="text-xs font-semibold text-on-base">Digital</p>
              </div>
            </div>
            <p className="text-base font-bold text-on-base">Rp 15.400.000</p>
          </div>
          {/* E-Wallet previews — desktop only */}
          <div className="hidden lg:block bg-surface border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-mint/10 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-mint" />
              </div>
              <div>
                <p className="text-[10px] text-muted">GoPay</p>
                <p className="text-xs font-semibold text-on-base">E-Wallet</p>
              </div>
            </div>
            <p className="text-base font-bold text-on-base">Rp 1.250.000</p>
          </div>
          <div className="hidden lg:block bg-surface border border-border rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue/10 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-blue" />
              </div>
              <div>
                <p className="text-[10px] text-muted">OVO</p>
                <p className="text-xs font-semibold text-on-base">E-Wallet</p>
              </div>
            </div>
            <p className="text-base font-bold text-on-base">Rp 875.000</p>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-surface border border-border rounded-2xl p-4 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue hidden lg:block" />
              <p className="text-xs font-semibold text-on-base">Income vs Expenses</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-mint/70" /><span className="text-[9px] text-muted">Income</span></span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-expense/70" /><span className="text-[9px] text-muted">Expense</span></span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-16 lg:flex-1 lg:min-h-[140px]">
            {[60, 30, 80, 20, 55, 15, 5].map((h, i) => (
              <div key={i} className="flex-1 flex gap-px items-end justify-center h-full">
                <div className="w-[45%] bg-mint/60 rounded-t-sm" style={{ height: `${h}%` }} />
                <div className="w-[45%] bg-expense/60 rounded-t-sm" style={{ height: `${Math.max(90 - h, 10)}%` }} />
              </div>
            ))}
          </div>
          {/* Day labels — desktop */}
          <div className="hidden lg:flex gap-1.5 mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day} className="flex-1 text-center text-[10px] text-muted font-medium">{day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card divide-y divide-border/50">
        {[
          { desc: "Freelance Web Dev", amt: "+Rp 4.500.000", type: "income" as const, cat: "Freelance", date: "May 29" },
          { desc: "Grab Food Delivery", amt: "-Rp 45.000", type: "expense" as const, cat: "Food", date: "May 29" },
          { desc: "Monthly Salary", amt: "+Rp 12.000.000", type: "income" as const, cat: "Salary", date: "May 28" },
          { desc: "Electric Bill", amt: "-Rp 350.000", type: "expense" as const, cat: "Utilities", date: "May 27" },
          { desc: "Coffee & Snacks", amt: "-Rp 68.000", type: "expense" as const, cat: "Food", date: "May 27" },
        ].map((txn) => (
          <div key={txn.desc} className="flex items-center gap-3 px-4 py-3">
            <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center shrink-0 ${txn.type === "income" ? "bg-mint/10" : "bg-expense/10"}`}>
              {txn.type === "income" ? <ArrowDownLeft className="w-3.5 h-3.5 text-mint" /> : <ArrowUpRight className="w-3.5 h-3.5 text-expense" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-base truncate">{txn.desc}</p>
              <p className="text-[10px] text-muted">{txn.cat}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-xs lg:text-sm font-semibold ${txn.type === "income" ? "text-mint" : "text-expense"}`}>{txn.amt}</p>
              <p className="text-[9px] text-muted hidden lg:block">{txn.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
