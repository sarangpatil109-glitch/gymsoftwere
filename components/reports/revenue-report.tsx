/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRevenueReport } from "@/hooks/useReports";
import { ReportFilters } from "@/types/report";
import { ReportFilterBar } from "./report-filters";
import { ExportDialog } from "./export-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";
import { useSystemPreferences } from "@/hooks/useSettings";
import { FileText } from "lucide-react";

export function RevenueReportView() {
  const [filters, setFilters] = useState<ReportFilters>({ dateRange: {} });
  const { data, isLoading } = useRevenueReport(filters);
  const { data: prefs } = useSystemPreferences();
  
  const columns = [
    { header: "Payment ID", dataKey: "id" },
    { header: "Member", dataKey: "member_name" },
    { header: "Membership", dataKey: "membership_type" },
    { header: "Amount", dataKey: "amount_paid" },
    { header: "Date", dataKey: "payment_date" },
    { header: "Method", dataKey: "payment_method" },
    { header: "Status", dataKey: "payment_status" },
  ];

  const exportData = data?.map(d => ({
    id: d.id,
    member_name: (d as any).members?.full_name,
    membership_type: (d as any).memberships?.membership_type,
    amount_paid: `${prefs?.currencySymbol || '₹'}${(d as any).amount_paid || (d as any).amountPaid}`,
    payment_date: format(new Date((d as any).payment_date || (d as any).paymentDate), 'dd MMM yyyy'),
    payment_method: (d as any).payment_method || (d as any).paymentMethod,
    payment_status: (d as any).payment_status || (d as any).status,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Revenue Report</h3>
        <ExportDialog title="Revenue Report" filename="revenue_report" data={exportData} columns={columns} />
      </div>

      <ReportFilterBar filters={filters} setFilters={setFilters} showMembershipType />

      <div className="border rounded-xl bg-card overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px]">
                  <EmptyState 
                    icon={FileText} 
                    title="No revenue records" 
                    description="No payments match the current filters." 
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell>{format(new Date(payment.payment_date || payment.paymentDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="font-medium">{payment.members?.full_name}</TableCell>
                  <TableCell>{payment.memberships?.membership_type}</TableCell>
                  <TableCell>{payment.payment_method || payment.paymentMethod}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {prefs?.currencySymbol || '₹'}{payment.amount_paid || payment.amountPaid}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
