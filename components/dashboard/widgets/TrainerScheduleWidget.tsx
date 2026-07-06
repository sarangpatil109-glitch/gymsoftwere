"use client";

import { useTodaysTrainerSchedule } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TrainerScheduleWidget() {
  const { data: trainers, isLoading } = useTodaysTrainerSchedule();

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Trainer Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all h-[300px] flex flex-col">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500/10 to-transparent border-b border-indigo-500/10 shrink-0">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <Users className="w-4 h-4" />
            Active Trainers
          </div>
          <span className="text-sm font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 py-0.5 px-2 rounded-full">
            {trainers?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        {!trainers || trainers.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-8">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">No active trainers.</p>
            <p className="text-xs text-slate-500 mt-1">Assign trainers to members to see them here.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {trainers.map((trainer: any) => {
                  const memberCount = trainer.members?.length || 0;
                  
                  return (
                    <div key={trainer.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                          {trainer.first_name[0]}{trainer.last_name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {trainer.first_name} {trainer.last_name}
                          </div>
                          <div className="text-xs text-slate-500">{trainer.specialization || 'Personal Trainer'}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                        {memberCount} Client{memberCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 text-center">
              <Link href="/trainer-panel" className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full text-indigo-600 dark:text-indigo-400 text-xs h-8" })}>
                Open Trainer Panel <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
