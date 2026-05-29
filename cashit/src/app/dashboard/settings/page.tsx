"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Smartphone,
} from "lucide-react";

interface SettingsItem {
  readonly label: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly href?: string;
}

const SETTINGS_ITEMS: readonly SettingsItem[] = [
  {
    label: "Profile",
    description: "Manage your personal information",
    icon: User,
  },
  {
    label: "Notifications",
    description: "Configure alerts and reminders",
    icon: Bell,
  },
  {
    label: "Security",
    description: "Password, 2FA, and sessions",
    icon: Shield,
  },
  {
    label: "Linked Accounts",
    description: "Manage connected wallets and banks",
    icon: Smartphone,
  },
  {
    label: "Appearance",
    description: "Theme and display preferences",
    icon: Palette,
  },
  {
    label: "Help & Support",
    description: "FAQ, guides, and contact support",
    icon: HelpCircle,
  },
] as const;

export default function SettingsPage(): React.JSX.Element {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "user@example.com";
  const userImage = session?.user?.image ?? null;

  async function handleSignOut(): Promise<void> {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen bg-base pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-base/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center gap-2.5 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
            <Settings className="w-4 h-4 text-muted" />
          </div>
          <h1 className="text-base font-semibold text-on-base">Settings</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 flex flex-col gap-5">
        {/* User Profile Card */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card flex items-center gap-4">
          {userImage !== null ? (
            <Image
              src={userImage}
              alt={userName}
              width={48}
              height={48}
              className="rounded-full border-2 border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-surface-2 border-2 border-border flex items-center justify-center">
              <span className="text-lg font-bold text-mint">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-base truncate">
              {userName}
            </p>
            <p className="text-xs text-muted truncate">{userEmail}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted shrink-0" />
        </div>

        {/* Settings List */}
        <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden divide-y divide-border/50">
          {SETTINGS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-surface-2/50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-base">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted">{item.description}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full bg-expense/10 border border-expense/20 rounded-2xl px-5 py-3.5 flex items-center gap-3.5 hover:bg-expense/15 transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-expense/10 flex items-center justify-center shrink-0">
            <LogOut className="w-4 h-4 text-expense" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-expense">Sign Out</p>
            <p className="text-[10px] text-expense/60">
              Return to the login screen
            </p>
          </div>
        </button>

        {/* App version */}
        <p className="text-center text-[10px] text-muted/50">
          CashIt v0.1.0 • Made with 💚
        </p>
      </div>
    </div>
  );
}
