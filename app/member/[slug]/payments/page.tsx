"use client";

import { use } from "react";
import { usePortalMemberBySlug } from "@/hooks/useMemberPortal";
import { useMemberPayments } from "@/hooks/usePayments";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Download, CalendarDays, CheckCircle2, AlertCircle } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import Link from "next/link";

export default function MemberPaymentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: member, isLoading: isLoadingMember } = usePortalMemberBySlug(slug);
  const { data: payments, isLoading: isLoadingPayments } = useMemberPayments(member?.id || "");

  if (isLoadingMember || isLoadingPayments) {
    return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  if (!member) return <div className="text-center p-10">Member not found</div>;

  const isExpired = member.status === 'Expired' || (member.expiryDate && isAfter(new Date(), parseISO(member.expiryDate)));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments & Billing</h1>
        <p className="text-slate-500 mt-1">Manage your membership and view receipts.</p>
      </div>

      {/* Renewal Status */}
      <Card className={`rounded-2xl border-0 shadow-sm ${isExpired ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30'}`}>
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isExpired ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'}`}>
              {isExpired ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{isExpired ? 'Membership Expired' : 'Membership Active'}</h2>
              <p className="text-sm text-slate-500">
                {member.membershipType} Plan &bull; Expires on {member.expiryDate ? format(parseISO(member.expiryDate), 'MMMM dd, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
          {isExpired && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">Renew Now</Button>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-400" /> Payment History
          </h2>
        </div>
        <CardContent className="p-0">
          {!payments || payments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No payment history found.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-900/20 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-medium">
                        {format(parseISO(payment.paymentDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {payment.id.split('-')[0].toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ${payment.amountPaid}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          payment.status === 'Paid' ? 'border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                          payment.status === 'Pending' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                          'border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        }>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/receipt/${payment.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
