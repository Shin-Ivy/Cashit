"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
} from "lucide-react";

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}

export default function BottomNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none lg:hidden"
    >
      <div className="pointer-events-auto w-full max-w-md bg-surface/80 backdrop-blur-xl border border-border rounded-2xl shadow-card flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`
                relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 group
                ${active
                  ? "text-mint"
                  : "text-muted hover:text-on-base"
                }
              `}
            >
              {/* Active indicator glow */}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-mint/10 rounded-xl"
                />
              )}
              <Icon
                className={`relative z-10 w-5 h-5 transition-transform duration-200 ${
                  active ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span className="relative z-10 text-[10px] font-medium leading-none mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
