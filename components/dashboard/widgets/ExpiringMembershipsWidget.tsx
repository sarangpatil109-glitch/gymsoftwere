"use client";

import { useDashboardMemberships } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { differenceInDays, parseISO } from "date-fns";
import { Clock, Loader2, AlertTriangle, MessageCircle } from "lucide-react";
import Link from "next/link";

export function ExpiringMembershipsWidget() {
  const { data: expiringSoon, isLoading } = useDashboardMemberships(0, 7);

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Expiring Soon
          </CardTitle>
          <CardDescription>Memberships expiring in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-xl transition-all hover:shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-transparent border-b border-orange-500/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Expiring Memberships
            </CardTitle>
            <CardDescription className="mt-1">
              <span className="font-semibold text-orange-600 dark:text-orange-500">{expiringSoon?.length || 0}</span> memberships expiring in 7 days
            </CardDescription>
          </div>
          <Link href="/members" className={buttonVariants({ variant: "outline", size: "sm" })}>
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!expiringSoon || expiringSoon.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-medium">All caught up!</p>
            <p className="text-sm text-slate-500 mt-1">No memberships are expiring in the next 7 days.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b-slate-100 dark:border-b-slate-800">
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringSoon.map((ms: any) => {
                  const daysRemaining = Math.max(0, differenceInDays(parseISO(ms.end_date), new Date()));
                  let statusColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
                  if (daysRemaining === 0) statusColor = "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 animate-pulse";
                  else if (daysRemaining <= 3) statusColor = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";

                  return (
                    <TableRow key={ms.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {ms.members?.first_name} {ms.members?.last_name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{ms.members?.phone}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                          {ms.membership_plans?.name || "Custom Plan"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusColor} border-0 shadow-sm`}>
                          {daysRemaining === 0 ? "Today" : `In ${daysRemaining} days`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="default" className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-md">
                          Renew
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
