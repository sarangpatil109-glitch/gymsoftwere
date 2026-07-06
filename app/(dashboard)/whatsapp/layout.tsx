import { ReactNode } from "react";
import Link from "next/link";
import { MessageCircleCode, LayoutTemplate, Zap, History, Send } from "lucide-react";

export default function WhatsAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp Center</h1>
        <p className="text-muted-foreground mt-1">Manage automations, templates, and messaging logs.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Link 
          href="/whatsapp"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <MessageCircleCode className="h-4 w-4" /> Overview
        </Link>
        <Link 
          href="/whatsapp/templates"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <LayoutTemplate className="h-4 w-4" /> Templates
        </Link>
        <Link 
          href="/whatsapp/automations"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <Zap className="h-4 w-4" /> Automations
        </Link>
        <Link 
          href="/whatsapp/logs"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <History className="h-4 w-4" /> Message Logs
        </Link>
        <Link 
          href="/whatsapp/send"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white border border-blue-600 text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
        >
          <Send className="h-4 w-4" /> Send Message
        </Link>
      </div>

      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
