"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap, ListTree, FileText, Activity, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/automations", icon: Zap },
  { name: "Rules", href: "/automations/rules", icon: ListTree },
  { name: "Templates", href: "/automations/templates", icon: FileText },
  { name: "Logs", href: "/automations/logs", icon: Activity },
  { name: "Settings", href: "/automations/settings", icon: Settings },
];

export default function AutomationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Automation Center</h2>
        <p className="text-muted-foreground">Manage your automated workflows, messages, and triggers.</p>
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-4 lg:pb-0 px-4 lg:px-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
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
