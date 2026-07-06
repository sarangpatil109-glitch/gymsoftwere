"use client";

import { useInventoryProducts, useLowStockProducts, useRecentSales } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format, parseISO } from "date-fns";

export default function StoreDashboardPage() {
  const { data: products, isLoading: isLoadingProducts } = useInventoryProducts();
  const { data: lowStock, isLoading: isLoadingLowStock } = useLowStockProducts();
  const { data: recentSales, isLoading: isLoadingSales } = useRecentSales();

  if (isLoadingProducts || isLoadingLowStock || isLoadingSales) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  // Stats
  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((sum, p) => sum + p.stock, 0) || 0;
  const lowStockCount = lowStock?.length || 0;
  
  // Calculate total revenue from recent sales
  const totalRevenue = recentSales?.reduce((sum, s) => sum + s.final_amount, 0) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Products</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{totalProducts}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Total Stock Items</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{totalStock}</h3>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={lowStockCount > 0 ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-100 dark:border-red-900/30" : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900/30"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${lowStockCount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>Low Stock Alerts</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{lowStockCount}</h3>
              </div>
              <div className={`p-3 rounded-full ${lowStockCount > 0 ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400" : "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Recent Revenue</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">${totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!lowStock || lowStock.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">All stock levels are optimal.</p>
            ) : (
              <div className="space-y-4">
                {lowStock.slice(0, 5).map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.sku}</p>
                    </div>
                    <Badge variant="destructive" className="ml-2 shrink-0">
                      {item.stock} / {item.minimum_stock}
                    </Badge>
                  </div>
                ))}
                {lowStock.length > 5 && (
                  <Link href="/store/products" className="block text-center text-sm text-blue-600 hover:underline pt-2">
                    View all {lowStock.length} items
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Sales</CardTitle>
            <Link href="/store/reports" className="text-sm text-blue-600 hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {!recentSales || recentSales.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-xl">
                <p className="text-slate-500">No sales recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-l-lg">Date</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Method</th>
                      <th className="px-4 py-3 font-medium text-right rounded-r-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentSales.slice(0, 5).map(sale => (
                      <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                          {sale.created_at ? format(parseISO(sale.created_at), 'MMM dd, h:mm a') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {sale.member ? `${sale.member.first_name} ${sale.member.last_name}` : 'Walk-in Customer'}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{sale.payment_method}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                          ${sale.final_amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
