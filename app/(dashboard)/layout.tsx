import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
