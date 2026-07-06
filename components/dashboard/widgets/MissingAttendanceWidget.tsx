"use client";

import { useMissingAttendanceToday } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserMinus, Loader2, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MissingAttendanceWidget() {
  const { data: missing, isLoading } = useMissingAttendanceToday();

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <UserMinus className="w-4 h-4 text-amber-500" />
            Not Checked In Today
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all flex flex-col h-[300px]">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-amber-500/10 shrink-0">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
            <UserMinus className="w-4 h-4" />
            Missing Today
          </div>
          <span className="text-sm font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-500 py-0.5 px-2 rounded-full">
            {missing?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        {!missing || missing.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
              <UserMinus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">Amazing!</p>
            <p className="text-xs text-slate-500 mt-1">Everyone checked in today.</p>
          </div>
        ) : (
          <ScrollArea className="h-[240px]">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {missing.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                      {member.first_name[0]}{member.last_name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {member.first_name} {member.last_name}
                      </div>
                      <div className="text-xs text-slate-500">{member.phone}</div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
