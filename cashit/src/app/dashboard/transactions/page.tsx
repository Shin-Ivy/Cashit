import type { Metadata } from "next";
import { ArrowLeftRight, Search, Filter, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Transactions — CashIt",
  description: "View and manage all your transactions across wallets.",
};

export default function TransactionsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-base pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-base/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-blue" />
            </div>
            <h1 className="text-base font-semibold text-on-base">
              Transactions
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search transactions"
              className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-on-base transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Filter transactions"
              className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-on-base transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Placeholder Content */}
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center shadow-card">
            <Download className="w-7 h-7 text-muted" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-on-base mb-1">
              Transaction History
            </p>
            <p className="text-xs text-muted max-w-[240px]">
              Your full transaction history will appear here. Add transactions
              from the dashboard to get started.
            </p>
          </div>
          <div className="mt-2 px-4 py-2 rounded-xl bg-surface border border-border text-[10px] text-muted font-medium">
            🚧 Feature under development
          </div>
        </div>
      </div>
    </div>
  );
}
