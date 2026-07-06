/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMemberGrowthReport } from "@/hooks/useReports";
import { ReportFilters } from "@/types/report";
import { ReportFilterBar } from "./report-filters";
import { ExportDialog } from "./export-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MemberGrowthReportView() {
  const [filters, setFilters] = useState<ReportFilters>({ dateRange: {} });
  const { data, isLoading } = useMemberGrowthReport(filters);
  
  const columns = [
    { header: "Join Date", dataKey: "joining_date" },
    { header: "Member ID", dataKey: "member_id" },
    { header: "Name", dataKey: "full_name" },
    { header: "Mobile", dataKey: "mobile_number" },
    { header: "Gender", dataKey: "gender" },
    { header: "Status", dataKey: "status" },
  ];

  const exportData = data?.map((d: any) => ({
    joining_date: format(new Date(d.joining_date), 'dd MMM yyyy'),
    member_id: d.member_id,
    full_name: d.full_name,
    mobile_number: d.mobile_number,
    gender: d.gender,
    status: d.status,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Member Growth Report</h3>
        <ExportDialog title="Member Growth Report" filename="member_growth_report" data={exportData} columns={columns} />
      </div>

      <ReportFilterBar filters={filters} setFilters={setFilters} />

      <div className="border rounded-xl bg-card overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Join Date</TableHead>
              <TableHead>Member ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[300px]">
                  <EmptyState 
                    icon={Users} 
                    title="No member growth records" 
                    description="No member growth match the current filters." 
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell>{format(new Date(m.joining_date), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{m.member_id}</TableCell>
                  <TableCell className="font-medium">{m.full_name}</TableCell>
                  <TableCell>{m.mobile_number}</TableCell>
                  <TableCell>{m.gender}</TableCell>
                  <TableCell>
                    <Badge variant={m.status === 'Active' ? 'default' : 'secondary'} className={m.status === 'Active' ? 'bg-emerald-500' : ''}>
                      {m.status}
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
