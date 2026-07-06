"use client";

import { useAutomationLogs } from "@/hooks/useAutomations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, XCircle, SkipForward } from "lucide-react";

export default function AutomationsLogsPage() {
  const { data: logs, isLoading } = useAutomationLogs();

  if (isLoading) {
    return <div>Loading logs...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-destructive mr-2" />;
      case 'SKIPPED': return <SkipForward className="h-4 w-4 text-muted-foreground mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Execution Logs</h3>
          <p className="text-sm text-muted-foreground">History of all automation executions.</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Rule Triggered</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap">
                  {log.executed_at ? format(new Date(log.executed_at), "MMM d, yyyy h:mm:ss a") : "Unknown"}
                </TableCell>
                <TableCell className="font-medium">
                  {log.rule?.name || "Unknown Rule"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted">
                    {log.trigger_type.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getStatusIcon(log.status)}
                    <span className="text-sm font-medium">{log.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {log.message || "-"}
                </TableCell>
              </TableRow>
            ))}
            {logs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No execution logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
