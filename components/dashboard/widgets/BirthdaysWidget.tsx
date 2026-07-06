"use client";

import { useTodaysBirthdays } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Loader2, Send } from "lucide-react";

export function BirthdaysWidget() {
  const { data: birthdays, isLoading } = useTodaysBirthdays();

  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Gift className="w-4 h-4 text-pink-500" />
            Today's Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-2 bg-gradient-to-r from-pink-500/10 to-transparent border-b border-pink-500/10">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
            <Gift className="w-4 h-4" />
            Birthdays Today
          </div>
          <span className="text-sm font-bold bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 py-0.5 px-2 rounded-full">
            {birthdays?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!birthdays || birthdays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
              <Gift className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No birthdays today.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {birthdays.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {member.first_name[0]}{member.last_name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {member.first_name} {member.last_name}
                    </div>
                    <div className="text-xs text-slate-500">{member.phone}</div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/50">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
