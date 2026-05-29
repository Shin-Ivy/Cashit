"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  LogOut,
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

export default function DesktopSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userImage = session?.user?.image ?? null;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-surface border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
        <div className="w-9 h-9 bg-surface-2 border border-border rounded-xl flex items-center justify-center shadow-glow-mint">
          <Image
            src="/logo.png"
            alt="CashIt Logo"
            width={28}
            height={28}
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <span className="text-lg font-bold text-on-base tracking-tight">
          Cash<span className="text-mint">It</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4" aria-label="Sidebar navigation">
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
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${active
                  ? "text-mint bg-mint/10"
                  : "text-muted hover:text-on-base hover:bg-surface-2/50"
                }
              `}
            >
              {/* Active indicator bar */}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-mint rounded-full"
                />
              )}
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  active ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-border/50 px-4 py-4">
        <div className="flex items-center gap-3 px-2">
          {userImage !== null ? (
            <Image
              src={userImage}
              alt={userName}
              width={32}
              height={32}
              className="rounded-full border border-border shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-mint">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-on-base truncate">{userName}</p>
            <p className="text-[10px] text-muted truncate">
              {session?.user?.email ?? ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Sign out"
            className="w-8 h-8 rounded-lg bg-surface-2/50 hover:bg-expense/10 flex items-center justify-center text-muted hover:text-expense transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
