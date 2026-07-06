"use client";

import { useDashboardMemberships } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Loader2, ArrowRight } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function UpcomingRenewalsWidget() {
  const { data: upcoming, isLoading } = useDashboardMemberships(8, 30);

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            Upcoming Renewals
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
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-transparent border-b border-blue-500/10 shrink-0">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <CalendarDays className="w-4 h-4" />
            Upcoming Renewals
          </div>
          <span className="text-sm font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 py-0.5 px-2 rounded-full">
            {upcoming?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        {!upcoming || upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-8">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
              <CalendarDays className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">Nothing on the horizon.</p>
            <p className="text-xs text-slate-500 mt-1">No renewals scheduled for the rest of the month.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-auto">
              {upcoming.slice(0, 4).map((ms: any) => {
                const daysRemaining = Math.max(0, differenceInDays(parseISO(ms.end_date), new Date()));
                
                return (
                  <div key={ms.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {ms.members?.first_name} {ms.members?.last_name}
                      </div>
                      <div className="text-xs text-slate-500">{ms.membership_plans?.name || 'Membership'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        In {daysRemaining} days
                      </div>
                      <div className="text-xs text-slate-400">
                        {format(parseISO(ms.end_date), 'MMM d')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {upcoming.length > 4 && (
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 text-center">
                <Link href="/members" className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full text-blue-600 dark:text-blue-400 text-xs h-8" })}>
                  View All {upcoming.length} <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
