"use client";

import { useRecentSales, useInventoryProducts } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Download, PieChart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";

export default function StoreReportsPage() {
  const { data: recentSales, isLoading: isLoadingSales } = useRecentSales();
  const { data: products, isLoading: isLoadingProducts } = useInventoryProducts();

  if (isLoadingSales || isLoadingProducts) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  const totalRevenue = recentSales?.reduce((sum, sale) => sum + sale.final_amount, 0) || 0;
  
  // Calculate cost of goods sold based on items in recent sales
  let totalCost = 0;
  recentSales?.forEach(sale => {
    sale.items?.forEach(item => {
      totalCost += (item.product?.purchase_price || 0) * item.quantity;
    });
  });

  const grossProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Category distribution
  const categoryCount: Record<string, number> = {};
  products?.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + p.stock;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Store Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Financial overview and inventory analytics.</p>
        </div>
        <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100">${totalRevenue.toFixed(2)}</h3>
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> Based on 50 recent sales
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Gross Profit</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100">${grossProfit.toFixed(2)}</h3>
            <p className="text-xs text-slate-500 mt-2">Revenue minus COGS</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Profit Margin</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100">{margin.toFixed(1)}%</h3>
            <p className="text-xs text-slate-500 mt-2">Average across sold items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Stock by Category
            </CardTitle>
            <CardDescription>Current inventory distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {Object.entries(categoryCount).sort((a,b) => b[1] - a[1]).map(([category, count]) => {
                const total = Object.values(categoryCount).reduce((a,b) => a+b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{category}</span>
                      <span className="text-slate-500">{count} items ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5 text-amber-500" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Products approaching expiration date.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              {products?.filter(p => p.expiry_date).sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime()).slice(0, 5).map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Stock: {product.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      {format(parseISO(product.expiry_date!), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
