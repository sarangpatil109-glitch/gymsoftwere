"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ShoppingBag, ShoppingCart, BarChart3, Truck, Package, Tags, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/store", icon: Store },
    { name: "Point of Sale", href: "/store/pos", icon: ShoppingCart },
    { name: "Sales", href: "/store/sales", icon: ShoppingBag },
    { name: "Products", href: "/store/products", icon: Package },
    { name: "Categories", href: "/store/categories", icon: Tags },
    { name: "Suppliers", href: "/store/suppliers", icon: Truck },
    { name: "Purchases", href: "/store/purchases", icon: ClipboardList },
    { name: "Reports", href: "/store/reports", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory & POS</h1>
        <p className="text-muted-foreground mt-1">Manage stock, process sales, and view store reports.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors shrink-0",
                isActive 
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="h-4 w-4" /> {item.name}
            </Link>
          );
        })}
      </div>

      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
