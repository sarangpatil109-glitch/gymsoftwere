"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase, Kanban, PlusCircle, Calendar, FileText } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/crm", icon: Briefcase },
  { name: "Kanban Board", href: "/crm/board", icon: Kanban },
  { name: "Add Lead", href: "/crm/add", icon: PlusCircle },
  { name: "Calendar", href: "/crm/calendar", icon: Calendar },
  { name: "Reports", href: "/crm/reports", icon: FileText },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // On the specific lead profile page, we might not want the side nav or we want to keep it.
  // For consistency, let's keep it unless we want a full width.

  return (
    <div className="flex flex-col h-full space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Lead CRM</h2>
        <p className="text-muted-foreground">Manage your sales pipeline and visitor conversions.</p>
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-4 lg:pb-0 px-4 lg:px-0">
            {navItems.map((item) => {
              // Exact match for Dashboard, prefix match for others to keep active state when viewing a lead
              const isActive = item.href === "/crm" 
                ? pathname === "/crm"
                : pathname.startsWith(item.href) || (item.href === '/crm/board' && pathname.includes('/lead/'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
