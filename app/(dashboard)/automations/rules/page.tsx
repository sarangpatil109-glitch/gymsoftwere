"use client";

import { useAutomationRules, useUpdateAutomationRule } from "@/hooks/useAutomations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { format } from "date-fns";

export default function AutomationsRulesPage() {
  const { data: rules, isLoading } = useAutomationRules();
  const updateRule = useUpdateAutomationRule();

  if (isLoading) {
    return <div>Loading rules...</div>;
  }

  const handleToggle = (id: string, current: boolean) => {
    updateRule.mutate({ id, is_active: !current });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Automation Rules</h3>
          <p className="text-sm text-muted-foreground">Configure when automations should trigger.</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule Name</TableHead>
              <TableHead>Trigger Event</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Executed</TableHead>
              <TableHead>Executions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules?.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted">
                    {rule.trigger_type.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {rule.template?.name || <span className="text-muted-foreground">None</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={rule.is_active} 
                      onCheckedChange={() => handleToggle(rule.id, rule.is_active)} 
                    />
                    <span className="text-sm text-muted-foreground">
                      {rule.is_active ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {rule.last_executed_at ? format(new Date(rule.last_executed_at), "MMM d, yyyy h:mm a") : "Never"}
                </TableCell>
                <TableCell>{rule.execution_count || 0}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/10">
                    <Play className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rules?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No automation rules found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
