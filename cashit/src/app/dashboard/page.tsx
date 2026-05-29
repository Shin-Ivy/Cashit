import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — CashIt",
  description:
    "Track your wallets and spending in real time with CashIt multi-wallet management.",
};

export default function DashboardPage(): React.JSX.Element {
  return <DashboardClient />;
}
