/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMembershipReport } from "@/hooks/useReports";
import { ReportFilters } from "@/types/report";
import { ReportFilterBar } from "./report-filters";
import { ExportDialog } from "./export-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

export function MembershipReportView() {
  const [filters, setFilters] = useState<ReportFilters>({ dateRange: {} });
  const { data, isLoading } = useMembershipReport(filters);
  
  const columns = [
    { header: "Member", dataKey: "member_name" },
    { header: "Mobile", dataKey: "mobile" },
    { header: "Plan", dataKey: "membership_type" },
    { header: "Start Date", dataKey: "start_date" },
    { header: "Expiry Date", dataKey: "expiry_date" },
    { header: "Status", dataKey: "status" },
    { header: "Payment", dataKey: "payment_status" },
  ];

  const exportData = data?.map((d: any) => ({
    member_name: d.members?.full_name,
    mobile: d.members?.mobile_number,
    membership_type: d.membership_type,
    start_date: format(new Date(d.start_date), 'dd MMM yyyy'),
    expiry_date: format(new Date(d.expiry_date), 'dd MMM yyyy'),
    status: d.status,
    payment_status: d.payment_status,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Membership Report</h3>
        <ExportDialog title="Membership Report" filename="membership_report" data={exportData} columns={columns} />
      </div>

      <ReportFilterBar filters={filters} setFilters={setFilters} showMembershipType showPaymentStatus />

      <div className="border rounded-xl bg-card overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[300px]">
                  <EmptyState 
                    icon={CreditCard} 
                    title="No membership records" 
                    description="No memberships match the current filters." 
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    {m.members?.full_name}
                    <div className="text-xs text-muted-foreground">{m.members?.mobile_number}</div>
                  </TableCell>
                  <TableCell>{m.membership_type}</TableCell>
                  <TableCell>{format(new Date(m.start_date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{format(new Date(m.expiry_date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={m.status === 'Active' ? 'default' : 'secondary'} className={m.status === 'Active' ? 'bg-emerald-500' : ''}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.payment_status === 'Completed' ? 'default' : 'outline'} className={m.payment_status === 'Completed' ? 'bg-emerald-500' : ''}>
                      {m.payment_status}
                    </Badge>
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
