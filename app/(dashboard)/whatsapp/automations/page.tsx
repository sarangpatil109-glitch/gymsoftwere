"use client";

import { useAutomationRules, useWhatsAppTemplates, useUpdateAutomationRule } from "@/hooks/useWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WhatsAppAutomationsPage() {
  const { data: automations, isLoading: isLoadingAutomations } = useAutomationRules();
  const { data: templates, isLoading: isLoadingTemplates } = useWhatsAppTemplates();
  const { mutate: updateRule } = useUpdateAutomationRule();

  if (isLoadingAutomations || isLoadingTemplates) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  const handleToggle = (id: string, current: boolean) => {
    updateRule({ id, updates: { is_active: !current } });
  };

  const handleTemplateChange = (id: string, template_id: string | null) => {
    updateRule({ id, updates: { template_id } });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-semibold">Event Automations</h2>
        <p className="text-sm text-slate-500 mt-1">Configure which templates to send when specific events occur in GymOS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations?.map(rule => (
          <Card key={rule.id} className={rule.is_active ? "border-blue-200 dark:border-blue-900/50" : ""}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${rule.is_active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{rule.event_type.replace(/_/g, ' ')}</h3>
                    <p className="text-xs text-slate-500 mt-1">Delay: {rule.delay_minutes} minutes</p>
                  </div>
                </div>
                <Switch 
                  checked={rule.is_active} 
                  onCheckedChange={() => handleToggle(rule.id, rule.is_active)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message Template</label>
                <Select 
                  value={rule.template_id || ""} 
                  onValueChange={(val) => handleTemplateChange(rule.id, val)}
                  disabled={!rule.is_active}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.filter(t => t.status === 'APPROVED').map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!rule.is_active && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Enable automation to change template.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
