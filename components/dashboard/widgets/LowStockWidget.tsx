"use client";

import { useLowStockInventory } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PackageOpen, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function LowStockWidget() {
  const { data: lowStockItems, isLoading } = useLowStockInventory();

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PackageOpen className="w-4 h-4 text-purple-500" />
            Low Stock Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all h-[300px] flex flex-col">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-transparent border-b border-purple-500/10 shrink-0">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <PackageOpen className="w-4 h-4" />
            Low Stock
          </div>
          <span className="text-sm font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 py-0.5 px-2 rounded-full">
            {lowStockItems?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        {!lowStockItems || lowStockItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-8">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
              <PackageOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">Stock is healthy!</p>
            <p className="text-xs text-slate-500 mt-1">No products are running low.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-auto">
              {lowStockItems.slice(0, 4).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <PackageOpen className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">{item.category || 'Product'}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${item.quantity === 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'} border-0`}>
                    {item.quantity} left
                  </Badge>
                </div>
              ))}
            </div>
            {lowStockItems.length > 4 && (
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 text-center">
                <Link href="/store/products" className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full text-purple-600 dark:text-purple-400 text-xs h-8" })}>
                  View All {lowStockItems.length} <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
