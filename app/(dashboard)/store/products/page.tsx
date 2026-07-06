"use client";

import { useInventoryProducts } from "@/hooks/useInventory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Edit, Package, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { format, parseISO } from "date-fns";

export default function StoreProductsPage() {
  const { data: products, isLoading } = useInventoryProducts();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.barcode && p.barcode.includes(searchQuery))
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Product Catalog</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name, SKU, or barcode..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Price</th>
                <th className="px-6 py-4 font-medium text-center">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Package className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="h-10 w-10 object-cover rounded-lg" />
                          ) : (
                            <Package className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">SKU: {product.sku}</span>
                            {product.brand && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600">{product.brand}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">{product.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">${product.selling_price.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">Cost: ${product.purchase_price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center">
                        <span className={`font-bold text-lg ${product.stock <= product.minimum_stock ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                          {product.stock}
                        </span>
                        {product.stock <= product.minimum_stock && (
                          <div className="flex items-center gap-1 text-[10px] text-red-500 mt-1 font-medium bg-red-50 dark:bg-red-950/30 px-1.5 rounded">
                            <AlertTriangle className="h-3 w-3" /> Low Stock
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
