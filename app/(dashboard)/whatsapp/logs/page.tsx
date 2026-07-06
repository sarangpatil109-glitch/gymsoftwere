"use client";

import { useWhatsAppLogs, useRetryFailedMessage } from "@/hooks/useWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertCircle, CheckCheck, Check, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";

export default function WhatsAppLogsPage() {
  const { data: logs, isLoading } = useWhatsAppLogs();
  const { mutate: retryMessage, isPending: isRetrying } = useRetryFailedMessage();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  const handleRetry = (id: string) => {
    setRetryingId(id);
    retryMessage(id, {
      onSettled: () => setRetryingId(null)
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'READ': return <CheckCheck className="h-4 w-4 text-blue-500" />;
      case 'DELIVERED': return <CheckCheck className="h-4 w-4 text-slate-400" />;
      case 'SENT': return <Check className="h-4 w-4 text-slate-400" />;
      case 'FAILED': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-semibold">Message Logs</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time status of all messages sent from GymOS.</p>
      </div>

      <Card className="rounded-xl overflow-hidden border-0 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Recipient</th>
                <th className="px-6 py-4 font-medium min-w-[300px]">Message</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No message logs found.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.created_at ? format(parseISO(log.created_at), 'MMM dd, yyyy h:mm a') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                      {log.phone_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {log.template?.name || "Manual Message"}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                        {log.message_content}
                      </p>
                      {log.error_message && (
                        <p className="text-xs text-red-500 mt-1">{log.error_message}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {log.status.charAt(0) + log.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      {log.read_at && <div className="text-[10px] text-slate-400 mt-1 pl-6">{format(parseISO(log.read_at), 'h:mm a')}</div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.status === 'FAILED' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRetry(log.id)}
                          disabled={isRetrying && retryingId === log.id}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20"
                        >
                          {isRetrying && retryingId === log.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          Retry
                        </Button>
                      )}
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
