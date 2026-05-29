import BottomNav from "@/components/navigation/BottomNav";
import DesktopSidebar from "@/components/navigation/DesktopSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — visible only at lg: breakpoint */}
      <DesktopSidebar />

      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* Mobile bottom nav — hidden at lg: breakpoint */}
      <BottomNav />
    </div>
  );
}
