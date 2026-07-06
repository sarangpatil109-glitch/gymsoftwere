"use client";

import { useState } from "react";
import { useInventoryProducts, useProcessSale } from "@/hooks/useInventory";
import { useMembers } from "@/hooks/useMembers";
import { Product, POSCartItem, PaymentMethod } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, QrCode } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PointOfSalePage() {
  const { data: products, isLoading: isLoadingProducts } = useInventoryProducts();
  const { data: members, isLoading: isLoadingMembers } = useMembers();
  const { mutate: processSale, isPending } = useProcessSale();

  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");

  if (isLoadingProducts || isLoadingMembers) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  const filteredProducts = products?.filter(p => 
    p.stock > 0 && (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery))
    )
  ) || [];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Cannot add more than stock
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        if (newQ > 0 && newQ <= item.product.stock) return { ...item, quantity: newQ };
        if (newQ <= 0) return item; // Don't allow 0, use remove instead
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.selling_price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    processSale({
      cart,
      memberId: selectedMember || undefined,
      discount,
      paymentMethod
    }, {
      onSuccess: () => {
        setCart([]);
        setSelectedMember("");
        setDiscount(0);
        setSearchQuery("");
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500 min-h-[calc(100vh-12rem)]">
      
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Scan barcode or search products..." 
            className="pl-10 h-12 text-lg rounded-xl shadow-sm border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all flex flex-col h-full group"
            >
              <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg mb-3 flex items-center justify-center p-4">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="object-contain h-full w-full mix-blend-multiply dark:mix-blend-normal" />
                ) : (
                  <ShoppingCart className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-sm leading-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-600 line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-[10px] text-slate-500">{product.brand}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">${product.selling_price.toFixed(2)}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{product.stock} left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <Card className="w-full lg:w-[400px] xl:w-[450px] flex flex-col shrink-0 border-0 shadow-lg rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
        <CardHeader className="bg-white dark:bg-slate-900 border-b px-6 py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> Current Sale
          </CardTitle>
        </CardHeader>
        
        <div className="p-4 bg-white dark:bg-slate-900 border-b">
          <Select value={selectedMember} onValueChange={(val) => setSelectedMember(val || "")}>
            <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800/50 border-0">
              <SelectValue placeholder="Walk-in Customer (Select Member)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Walk-in Customer</SelectItem>
              {members?.map(m => (
                <SelectItem key={m.id} value={m.id}>{m.fullName} ({m.memberId})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardContent className="flex-1 overflow-y-auto p-0">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p>Cart is empty</p>
              <p className="text-sm">Add products to begin</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map(item => (
                <div key={item.product.id} className="p-4 flex gap-3 bg-white dark:bg-slate-900">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{item.product.name}</h4>
                    <div className="text-sm text-slate-500 mt-1">${item.product.selling_price.toFixed(2)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      ${(item.product.selling_price * item.quantity).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 border rounded-lg bg-slate-50 dark:bg-slate-800">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="h-7 w-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-lg transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="h-7 w-7 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-lg transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="h-7 w-7 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ml-1 rounded transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-white dark:bg-slate-900 border-t p-6 flex flex-col gap-4">
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Discount</span>
              <div className="flex items-center">
                <span className="text-slate-400 mr-2">$</span>
                <Input 
                  type="number" 
                  min="0"
                  max={subtotal}
                  className="w-20 h-8 text-right bg-slate-50 dark:bg-slate-800" 
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex justify-between items-end pt-2 border-t">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Total</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full mt-2">
            <Button 
              variant={paymentMethod === 'CARD' ? 'default' : 'outline'} 
              className={paymentMethod === 'CARD' ? 'bg-slate-800 text-white hover:bg-slate-900' : ''}
              onClick={() => setPaymentMethod('CARD')}
            >
              <CreditCard className="h-4 w-4 mr-2" /> Card
            </Button>
            <Button 
              variant={paymentMethod === 'CASH' ? 'default' : 'outline'}
              className={paymentMethod === 'CASH' ? 'bg-slate-800 text-white hover:bg-slate-900' : ''}
              onClick={() => setPaymentMethod('CASH')}
            >
              <Banknote className="h-4 w-4 mr-2" /> Cash
            </Button>
            <Button 
              variant={paymentMethod === 'UPI' ? 'default' : 'outline'}
              className={paymentMethod === 'UPI' ? 'bg-slate-800 text-white hover:bg-slate-900' : ''}
              onClick={() => setPaymentMethod('UPI')}
            >
              <QrCode className="h-4 w-4 mr-2" /> UPI
            </Button>
          </div>

          <Button 
            className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
            disabled={cart.length === 0 || isPending}
            onClick={handleCheckout}
          >
            {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Complete Sale"}
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
