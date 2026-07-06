"use client";

import { useWhatsAppLogs, useAutomationRules, useWhatsAppTemplates } from "@/hooks/useWhatsApp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MessageCircle, Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format, parseISO } from "date-fns";

export default function WhatsAppDashboardPage() {
  const { data: logs, isLoading: isLoadingLogs } = useWhatsAppLogs();
  const { data: automations, isLoading: isLoadingAutomations } = useAutomationRules();
  const { data: templates, isLoading: isLoadingTemplates } = useWhatsAppTemplates();

  if (isLoadingLogs || isLoadingAutomations || isLoadingTemplates) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  // Calculate stats
  const totalSent = logs?.filter(l => l.status !== 'PENDING' && l.status !== 'FAILED').length || 0;
  const totalFailed = logs?.filter(l => l.status === 'FAILED').length || 0;
  const activeAutomations = automations?.filter(a => a.is_active).length || 0;
  const approvedTemplates = templates?.filter(t => t.status === 'APPROVED').length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Sent</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{totalSent}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-400">
                <Send className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-100 dark:border-red-900/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Failed Messages</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{totalFailed}</h3>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full text-red-600 dark:text-red-400">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Automations</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{activeAutomations}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Approved Templates</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{approvedTemplates}</h3>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg">Recent Message Activity</CardTitle>
            <CardDescription>Latest WhatsApp messages sent through the platform.</CardDescription>
          </div>
          <Link href="/whatsapp/logs" className="text-sm text-blue-600 hover:underline">View All Logs</Link>
        </CardHeader>
        <CardContent>
          {!logs || logs.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-xl">
              <MessageCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No message logs found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{log.phone_number}</span>
                      <span className="text-sm text-slate-500">&bull; {log.template?.name || "Manual Message"}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{log.message_content}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-sm">
                    <div className="text-slate-500">
                      {log.created_at ? format(parseISO(log.created_at), 'MMM dd, h:mm a') : ''}
                    </div>
                    <Badge variant="outline" className={
                      log.status === 'READ' ? 'border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20' :
                      log.status === 'DELIVERED' ? 'border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20' :
                      log.status === 'SENT' ? 'border-slate-200 text-slate-700 bg-slate-50 dark:bg-slate-900/20' :
                      log.status === 'FAILED' ? 'border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20' :
                      'border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/20'
                    }>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
