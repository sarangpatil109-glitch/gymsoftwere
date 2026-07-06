"use client";

import { usePaymentMethods, useTogglePaymentMethod } from "@/hooks/usePaymentMethods";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Banknote, Smartphone, FileCheck, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PaymentMethodsSettings() {
  const { data: methods, isLoading } = usePaymentMethods();
  const toggleMethod = useTogglePaymentMethod();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const getIcon = (name: string) => {
    switch(name.toLowerCase()) {
      case 'cash': return <Banknote className="w-5 h-5 text-emerald-500" />;
      case 'upi': return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case 'card': return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'bank transfer': return <CreditCard className="w-5 h-5 text-orange-500" />;
      case 'cheque': return <FileCheck className="w-5 h-5 text-purple-500" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <p className="text-sm text-muted-foreground">Enable or disable payment methods accepted at your gym.</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods?.map((method) => (
            <Card key={method.id} className={method.isEnabled ? "border-primary/50 bg-primary/5" : "bg-muted/30"}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-md shadow-sm border">
                    {getIcon(method.methodName)}
                  </div>
                  <div>
                    <Label className="text-base font-semibold">{method.methodName}</Label>
                    <p className="text-xs text-muted-foreground">
                      {method.isEnabled ? "Active and available" : "Currently disabled"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={method.isEnabled}
                  onCheckedChange={(val) => toggleMethod.mutate({ id: method.id, isEnabled: val })}
                  disabled={toggleMethod.isPending}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
