"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receiptSettingsSchema, ReceiptSettingsFormValues } from "@/validation/settingsSchema";
import { useReceiptSettings, useUpdateReceiptSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function ReceiptSettings() {
  const { data: receipt, isLoading } = useReceiptSettings();
  const updateReceipt = useUpdateReceiptSettings();

  const form = useForm<ReceiptSettingsFormValues>({
    resolver: zodResolver(receiptSettingsSchema),
    defaultValues: {
      receiptPrefix: "PAY",
      receiptStartingNumber: 1,
      logoPosition: "Left",
      printSize: "A4",
      autoReceiptNumber: true,
      authorizedSignatureText: "Authorized Signature",
    }
  });

  const { register, handleSubmit, reset, setValue, watch } = form;
  
  const autoReceiptNumber = watch("autoReceiptNumber");
  const logoPosition = watch("logoPosition");
  const printSize = watch("printSize");

  useEffect(() => {
    if (receipt) {
      reset({
        receiptHeader: receipt.receiptHeader || "",
        receiptFooter: receipt.receiptFooter || "",
        authorizedSignatureText: receipt.authorizedSignatureText || "Authorized Signature",
        gstNumber: receipt.gstNumber || "",
        receiptPrefix: receipt.receiptPrefix || "PAY",
        receiptStartingNumber: receipt.receiptStartingNumber || 1,
        logoPosition: (receipt.logoPosition as "Left" | "Center" | "Right") || "Left",
        printSize: (receipt.printSize as "A4" | "Thermal 80mm" | "Thermal 58mm") || "A4",
        autoReceiptNumber: receipt.autoReceiptNumber ?? true,
      });
    }
  }, [receipt, reset]);

  const onSubmit = (data: ReceiptSettingsFormValues) => {
    updateReceipt.mutate({ ...data, id: receipt?.id });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Receipt Settings</h2>
        <p className="text-sm text-muted-foreground">Configure how payment receipts look when printed.</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form id="receipt-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label>Receipt Prefix</Label>
              <Input {...register("receiptPrefix")} placeholder="e.g. PAY" />
            </div>

            <div className="space-y-2">
              <Label>Starting Number</Label>
              <Input type="number" {...register("receiptStartingNumber", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2 col-span-2">
              <div className="flex items-center space-x-2 border rounded-md p-4 bg-muted/20">
                <Switch 
                  checked={autoReceiptNumber}
                  onCheckedChange={(val) => setValue("autoReceiptNumber", val)}
                />
                <div className="space-y-0.5">
                  <Label>Auto-generate receipt numbers</Label>
                  <p className="text-xs text-muted-foreground">If enabled, system will automatically increment the receipt number based on database sequences.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Receipt Header Text</Label>
              <Input {...register("receiptHeader")} placeholder="e.g. Welcome to GymOS" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Receipt Footer Text</Label>
              <Input {...register("receiptFooter")} placeholder="e.g. Thank you for your payment! No refunds." />
            </div>

            <div className="space-y-2">
              <Label>Authorized Signature Text</Label>
              <Input {...register("authorizedSignatureText")} placeholder="Authorized Signature" />
            </div>

            <div className="space-y-2">
              <Label>GST / Tax Number on Receipt</Label>
              <Input {...register("gstNumber")} placeholder="Optional" />
            </div>

            <div className="space-y-2">
              <Label>Logo Position</Label>
              <Select onValueChange={(val: "Left" | "Center" | "Right" | null) => { if (val) setValue("logoPosition", val) }} defaultValue={logoPosition}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Center">Center</SelectItem>
                  <SelectItem value="Right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Print Size Default</Label>
              <Select onValueChange={(val: "A4" | "Thermal 80mm" | "Thermal 58mm" | null) => { if (val) setValue("printSize", val) }} defaultValue={printSize}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4 Size</SelectItem>
                  <SelectItem value="Thermal 80mm">Thermal 80mm</SelectItem>
                  <SelectItem value="Thermal 58mm">Thermal 58mm</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </form>
      </div>

      <div className="px-6 py-4 border-t bg-muted/20 flex justify-end">
        <Button type="submit" form="receipt-form" disabled={updateReceipt.isPending}>
          {updateReceipt.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Receipt Settings"}
        </Button>
      </div>
    </div>
  );
}
