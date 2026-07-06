"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AutomationsSettingsPage() {
  const handleSave = () => {
    toast.success("Settings saved successfully.");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">Automation Settings</h3>
        <p className="text-sm text-muted-foreground">Configure global preferences for your automation engine.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Engine Status</CardTitle>
          <CardDescription>Master switch to enable or disable all automations instantly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Automation Engine</Label>
              <p className="text-sm text-muted-foreground">If disabled, no new automation jobs will be queued.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Delivery Channels</CardTitle>
          <CardDescription>Select the preferred channels for outgoing automated messages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Primary Channel</Label>
            <Select defaultValue="whatsapp">
              <SelectTrigger>
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Jobs will use this channel by default unless the rule specifies otherwise.</p>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4 mt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Fallback to Email</Label>
              <p className="text-sm text-muted-foreground">If the primary channel fails, attempt delivery via Email.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
