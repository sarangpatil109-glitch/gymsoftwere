"use client";

import { useState } from "react";
import { 
  Building2, 
  CreditCard, 
  LayoutDashboard, 
  Palette, 
  Receipt, 
  Settings as SettingsIcon,
  ShieldAlert,
  Users
} from "lucide-react";
import { GymProfileSettings } from "@/components/settings/gym-profile";
import { MembershipPlansSettings } from "@/components/settings/membership-plans";
import { TrainersSettings } from "@/components/settings/trainers";
import { PaymentMethodsSettings } from "@/components/settings/payment-methods";
import { ReceiptSettings } from "@/components/settings/receipt-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { SystemPreferencesSettings } from "@/components/settings/system-preferences";
import { BackupRestoreSettings } from "@/components/settings/backup-restore";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", name: "Gym Profile", icon: Building2 },
  { id: "plans", name: "Membership Plans", icon: LayoutDashboard },
  { id: "trainers", name: "Trainers", icon: Users },
  { id: "payments", name: "Payment Methods", icon: CreditCard },
  { id: "receipts", name: "Receipt Settings", icon: Receipt },
  { id: "theme", name: "Theme & Branding", icon: Palette },
  { id: "system", name: "System Preferences", icon: SettingsIcon },
  { id: "backup", name: "Backup & Restore", icon: ShieldAlert },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 border-r bg-background/50 flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your gym configuration</p>
        </div>
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-9rem)]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-muted/10 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto bg-card border rounded-lg shadow-sm min-h-[500px]">
          {activeTab === "profile" && <GymProfileSettings />}
          {activeTab === "plans" && <MembershipPlansSettings />}
          {activeTab === "trainers" && <TrainersSettings />}
          {activeTab === "payments" && <PaymentMethodsSettings />}
          {activeTab === "receipts" && <ReceiptSettings />}
          {activeTab === "theme" && <ThemeSettings />}
          {activeTab === "system" && <SystemPreferencesSettings />}
          {activeTab === "backup" && <BackupRestoreSettings />}
        </div>
      </div>
    </div>
  );
}
