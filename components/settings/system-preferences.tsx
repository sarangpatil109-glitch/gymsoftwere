"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { systemPreferencesSchema, SystemPreferencesFormValues } from "@/validation/settingsSchema";
import { useSystemPreferences, useUpdateSystemPreferences } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { FactoryResetSettings } from "./factory-reset";

export function SystemPreferencesSettings() {
  const { data: prefs, isLoading } = useSystemPreferences();
  const updatePrefs = useUpdateSystemPreferences();

  const form = useForm<SystemPreferencesFormValues>({
    resolver: zodResolver(systemPreferencesSchema),
    defaultValues: {
      dateFormat: "DD/MM/YYYY",
      currencySymbol: "₹",
      weightUnit: "Kg",
      heightUnit: "Cm",
      timeFormat: "12 Hour",
      language: "English"
    }
  });

  const { register, handleSubmit, reset, setValue, watch } = form;
  const weightUnit = watch("weightUnit");
  const heightUnit = watch("heightUnit");
  const timeFormat = watch("timeFormat");
  const language = watch("language");

  useEffect(() => {
    if (prefs) {
      reset({
        dateFormat: prefs.dateFormat || "DD/MM/YYYY",
        currencySymbol: prefs.currencySymbol || "₹",
        weightUnit: prefs.weightUnit || "Kg",
        heightUnit: prefs.heightUnit || "Cm",
        timeFormat: prefs.timeFormat || "12 Hour",
        language: prefs.language || "English",
      });
    }
  }, [prefs, reset]);

  const onSubmit = (data: SystemPreferencesFormValues) => {
    updatePrefs.mutate(data);
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">System Preferences</h2>
        <p className="text-sm text-muted-foreground">Configure units, formats, and basic system settings.</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form id="system-prefs-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Input {...register("dateFormat")} placeholder="DD/MM/YYYY" />
            </div>

            <div className="space-y-2">
              <Label>Currency Symbol</Label>
              <Input {...register("currencySymbol")} placeholder="₹, $, €" />
            </div>

            <div className="space-y-2">
              <Label>Weight Unit</Label>
              <Select onValueChange={(val: "Kg" | "Lb" | null) => { if (val) setValue("weightUnit", val) }} defaultValue={weightUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kg">Kg</SelectItem>
                  <SelectItem value="Lb">Lb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Height Unit</Label>
              <Select onValueChange={(val: "Cm" | "Ft" | null) => { if (val) setValue("heightUnit", val) }} defaultValue={heightUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cm">Cm</SelectItem>
                  <SelectItem value="Ft">Ft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select onValueChange={(val: "12 Hour" | "24 Hour" | null) => { if (val) setValue("timeFormat", val) }} defaultValue={timeFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="12 Hour">12 Hour</SelectItem>
                  <SelectItem value="24 Hour">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select onValueChange={(val: "English" | null) => { if (val) setValue("language", val) }} defaultValue={language}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
          </div>
        </form>
      </div>

      <div className="px-6 py-4 border-t bg-muted/20 flex justify-end">
        <Button type="submit" form="system-prefs-form" disabled={updatePrefs.isPending}>
          {updatePrefs.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Preferences"}
        </Button>
      </div>

      <FactoryResetSettings />
    </div>
  );
}
