"use client";

import { usePendingPaymentsList } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { differenceInDays, parseISO } from "date-fns";
import { IndianRupee, Loader2, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";

export function PendingPaymentsWidget() {
  const { data: pendingPayments, isLoading } = usePendingPaymentsList();

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-rose-500" />
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  const totalAmount = pendingPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800/50 shadow-xl transition-all hover:shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-rose-500/10 to-transparent border-b border-rose-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <CreditCard className="w-5 h-5" />
              Pending Payments
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span className="font-semibold text-rose-600 dark:text-rose-500">{pendingPayments?.length || 0}</span> members pending
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{totalAmount.toLocaleString()}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Pending</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!pendingPayments || pendingPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-medium">No pending payments!</p>
            <p className="text-sm text-slate-500 mt-1">All members are fully paid up.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b-slate-100 dark:border-b-slate-800">
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.slice(0, 5).map((payment: any) => {
                  const daysOverdue = payment.payment_date 
                    ? Math.max(0, differenceInDays(new Date(), parseISO(payment.payment_date)))
                    : 0;

                  return (
                    <TableRow key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {payment.members?.first_name} {payment.members?.last_name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{payment.members?.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-rose-600 dark:text-rose-400">
                          ₹{payment.amount?.toLocaleString() || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {daysOverdue > 0 ? (
                          <Badge variant="outline" className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-0 shadow-sm">
                            {daysOverdue} days overdue
                          </Badge>
                        ) : (
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                          Collect
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {pendingPayments.length > 5 && (
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-center">
                <Link href="/payments" className={buttonVariants({ variant: "ghost", size: "sm", className: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300" })}>
                  View All {pendingPayments.length} Pending <ExternalLink className="ml-2 w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
