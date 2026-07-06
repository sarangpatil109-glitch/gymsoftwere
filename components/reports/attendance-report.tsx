/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAttendanceReport } from "@/hooks/useReports";
import { ReportFilters } from "@/types/report";
import { ReportFilterBar } from "./report-filters";
import { ExportDialog } from "./export-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";
import { UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AttendanceReportView() {
  const [filters, setFilters] = useState<ReportFilters>({ dateRange: {} });
  const { data, isLoading } = useAttendanceReport(filters);
  
  const columns = [
    { header: "Date", dataKey: "attendance_date" },
    { header: "Member", dataKey: "member_name" },
    { header: "Mobile", dataKey: "mobile" },
    { header: "Check In", dataKey: "check_in" },
    { header: "Check Out", dataKey: "check_out" },
    { header: "Status", dataKey: "status" },
  ];

  const exportData = data?.map((d: Record<string, any>) => ({
    attendance_date: format(new Date(d.attendance_date), 'dd MMM yyyy'),
    member_name: d.members?.full_name,
    mobile: d.members?.mobile_number,
    check_in: d.check_in_time ? format(new Date(d.check_in_time), 'hh:mm a') : '-',
    check_out: d.check_out_time ? format(new Date(d.check_out_time), 'hh:mm a') : '-',
    status: d.status,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Attendance Report</h3>
        <ExportDialog title="Attendance Report" filename="attendance_report" data={exportData} columns={columns} />
      </div>

      <ReportFilterBar filters={filters} setFilters={setFilters} />

      <div className="border rounded-xl bg-card overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px]">
                  <EmptyState 
                    icon={UserCheck} 
                    title="No attendance records" 
                    description="No check-ins match the current filters." 
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.map((a: Record<string, any>) => (
                <TableRow key={a.id}>
                  <TableCell>{format(new Date(a.attendance_date), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="font-medium">
                    {a.members?.full_name}
                    <div className="text-xs text-muted-foreground">{a.members?.mobile_number}</div>
                  </TableCell>
                  <TableCell>{a.check_in_time ? format(new Date(a.check_in_time), 'hh:mm a') : '-'}</TableCell>
                  <TableCell>{a.check_out_time ? format(new Date(a.check_out_time), 'hh:mm a') : '-'}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === 'Present' ? 'default' : 'secondary'} className={a.status === 'Present' ? 'bg-blue-500' : ''}>
                      {a.status}
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
