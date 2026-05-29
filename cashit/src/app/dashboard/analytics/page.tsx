import type { Metadata } from "next";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics — CashIt",
  description: "Visualize your spending patterns and financial insights.",
};

export default function AnalyticsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-base pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-base/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center gap-2.5 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-mint/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-mint" />
          </div>
          <h1 className="text-base font-semibold text-on-base">Analytics</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 flex flex-col gap-5">
        {/* Placeholder Cards */}
        <div className="bg-surface border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-mint" />
            <h3 className="text-xs font-semibold text-on-base">
              Spending by Category
            </h3>
          </div>
          {/* Placeholder donut */}
          <div className="flex items-center justify-center py-8">
            <div className="w-32 h-32 rounded-full border-[12px] border-surface-2 relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#76E8B6 0% 35%, #4B96F3 35% 55%, #F87171 55% 75%, #64748B 75% 100%)",
                  mask: "radial-gradient(farthest-side, transparent 60%, #000 60.5%)",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent 60%, #000 60.5%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-on-base">4 categories</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { label: "Food & Drink", pct: "35%", color: "bg-mint" },
              { label: "Transport", pct: "20%", color: "bg-blue" },
              { label: "Utilities", pct: "20%", color: "bg-expense" },
              { label: "Other", pct: "25%", color: "bg-muted" },
            ].map((cat) => (
              <div
                key={cat.label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2/50"
              >
                <span
                  className={`w-2 h-2 rounded-full ${cat.color} shrink-0`}
                />
                <span className="text-[10px] text-muted flex-1 truncate">
                  {cat.label}
                </span>
                <span className="text-[10px] font-semibold text-on-base">
                  {cat.pct}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue" />
            <h3 className="text-xs font-semibold text-on-base">
              Monthly Trend
            </h3>
          </div>
          <div className="flex items-center justify-center py-10">
            <div className="px-4 py-2 rounded-xl bg-surface-2 border border-border text-[10px] text-muted font-medium">
              🚧 Advanced analytics coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
