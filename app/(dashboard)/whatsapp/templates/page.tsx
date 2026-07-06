"use client";

import { useWhatsAppTemplates } from "@/hooks/useWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";

export default function WhatsAppTemplatesPage() {
  const { data: templates, isLoading } = useWhatsAppTemplates();

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Message Templates</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map(template => (
          <Card key={template.id} className="flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900">
                  {template.category}
                </Badge>
                <Badge variant="secondary" className={
                  template.status === 'APPROVED' ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' :
                  template.status === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                }>
                  {template.status}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                {template.name}
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 flex-1 whitespace-pre-wrap font-mono">
                {template.content}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>{template.language}</span>
                <span>Variables: {template.variables?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
