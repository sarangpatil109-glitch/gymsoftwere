"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { themeSettingsSchema, ThemeSettingsFormValues } from "@/validation/settingsSchema";
import { useThemeSettings, useUpdateThemeSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function ThemeSettings() {
  const { data: theme, isLoading } = useThemeSettings();
  const updateTheme = useUpdateThemeSettings();

  const form = useForm<ThemeSettingsFormValues>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      primaryColor: "#3b82f6",
      sidebarColor: "#1e293b",
      darkMode: false,
      softwareTitle: "GymOS",
    }
  });

  const { register, handleSubmit, reset, setValue, watch } = form;
  const darkMode = watch("darkMode");

  useEffect(() => {
    if (theme) {
      reset({
        primaryColor: theme.primaryColor || "#3b82f6",
        sidebarColor: theme.sidebarColor || "#1e293b",
        darkMode: theme.darkMode || false,
        softwareTitle: theme.softwareTitle || "GymOS",
      });
    }
  }, [theme, reset]);

  const onSubmit = (data: ThemeSettingsFormValues) => {
    updateTheme.mutate({ ...data, id: theme?.id });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Theme & Branding</h2>
        <p className="text-sm text-muted-foreground">Customize the look and feel of your software.</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form id="theme-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Software Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Software Title (Browser Tab)</Label>
                <Input {...register("softwareTitle")} />
              </div>
            </div>
            {/* Future ready: Add Logo and Favicon uploads here */}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Color Scheme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2 items-center">
                  <Input type="color" className="w-12 h-12 p-1" {...register("primaryColor")} />
                  <Input {...register("primaryColor")} className="uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sidebar Color</Label>
                <div className="flex gap-2 items-center">
                  <Input type="color" className="w-12 h-12 p-1" {...register("sidebarColor")} />
                  <Input {...register("sidebarColor")} className="uppercase" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={darkMode}
                onCheckedChange={(val) => setValue("darkMode", val)}
              />
              <Label>Enable Dark Mode</Label>
            </div>
          </div>

        </form>
      </div>

      <div className="px-6 py-4 border-t bg-muted/20 flex justify-end">
        <Button type="submit" form="theme-form" disabled={updateTheme.isPending}>
          {updateTheme.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Theme Settings"}
        </Button>
      </div>
    </div>
  );
}
