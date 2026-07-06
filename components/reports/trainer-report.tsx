/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useTrainerReport } from "@/hooks/useReports";
import { ReportFilters } from "@/types/report";
import { ReportFilterBar } from "./report-filters";
import { ExportDialog } from "./export-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";

export function TrainerReportView() {
  const [filters, setFilters] = useState<ReportFilters>({ dateRange: {} });
  const { data, isLoading } = useTrainerReport(filters);
  
  const columns = [
    { header: "Trainer Name", dataKey: "full_name" },
    { header: "Phone", dataKey: "phone" },
    { header: "Specialization", dataKey: "specialization" },
    { header: "Experience (Yrs)", dataKey: "experienceYears" },
    { header: "Status", dataKey: "status" },
  ];

  const exportData = data?.map((d: any) => ({
    full_name: d.full_name,
    phone: d.phone,
    specialization: d.specialization || '-',
    experienceYears: d.experienceYears,
    status: d.status,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Trainer Report</h3>
        <ExportDialog title="Trainer Report" filename="trainer_report" data={exportData} columns={columns} />
      </div>

      <ReportFilterBar filters={filters} setFilters={setFilters} />

      <div className="border rounded-xl bg-card overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px]">
                  <EmptyState 
                    icon={UserCheck} 
                    title="No trainers found" 
                    description="No trainers match the current filters." 
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.full_name}</TableCell>
                  <TableCell>{t.phone}</TableCell>
                  <TableCell>{t.specialization || '-'}</TableCell>
                  <TableCell>{t.experienceYears} Years</TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'Active' ? 'default' : 'secondary'} className={t.status === 'Active' ? 'bg-emerald-500' : ''}>
                      {t.status}
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
