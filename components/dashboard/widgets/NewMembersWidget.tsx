"use client";

import { useNewMembersToday } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserPlus, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

export function NewMembersWidget() {
  const { data: newMembers, isLoading } = useNewMembersToday();

  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-500" />
            New Members Today
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
      <CardHeader className="pb-2 bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-emerald-500/10">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <UserPlus className="w-4 h-4" />
            New Members
          </div>
          <span className="text-sm font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 py-0.5 px-2 rounded-full">
            {newMembers?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!newMembers || newMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
              <UserPlus className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No new signups today.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {newMembers.map((member: any) => (
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
                <Link href={`/member/${member.member_slug || member.member_id}`} className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })}>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
