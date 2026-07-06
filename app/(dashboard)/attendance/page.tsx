"use client";

import { useState, useMemo } from "react";
import { useAttendance, useAttendanceStats } from "@/hooks/useAttendance";
import { useCheckOut } from "@/hooks/useCheckOut";
import { useDebounce } from "@/hooks/useDebounce";
import { EmptyState } from "@/components/ui/empty-state";
import { SummaryCards } from "@/components/attendance/summary-cards";
import { SearchFilters } from "@/components/attendance/search-filters";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { MarkAttendanceModal } from "@/components/attendance/mark-attendance-modal";
import { Button } from "@/components/ui/button";
import { Plus, UserCheck, Loader2 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function AttendancePage() {
  const [isMarkOpen, setIsMarkOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("today"); // today, yesterday, last7days, last30days, all
  
  const { data: stats, isLoading: isLoadingStats } = useAttendanceStats();
  const { data: attendances = [], isLoading: isLoadingAttendance } = useAttendance();
  const checkOut = useCheckOut();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Client-side filtering
  const filteredAttendances = useMemo(() => {
    let filtered = attendances;

    // Search Filter
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.member.fullName.toLowerCase().includes(q) ||
        (a.member.memberId && a.member.memberId.toLowerCase().includes(q)) ||
        a.member.mobileNumber.includes(q)
      );
    }

    // Date Filter
    const today = startOfDay(new Date());
    if (dateFilter === "today") {
      filtered = filtered.filter(a => a.attendanceDate === format(today, "yyyy-MM-dd"));
    } else if (dateFilter === "yesterday") {
      const yesterday = format(subDays(today, 1), "yyyy-MM-dd");
      filtered = filtered.filter(a => a.attendanceDate === yesterday);
    } else if (dateFilter === "last7days") {
      const last7 = startOfDay(subDays(today, 7));
      filtered = filtered.filter(a => new Date(a.attendanceDate) >= last7);
    } else if (dateFilter === "last30days") {
      const last30 = startOfDay(subDays(today, 30));
      filtered = filtered.filter(a => new Date(a.attendanceDate) >= last30);
    }

    return filtered;
  }, [attendances, debouncedSearchQuery, dateFilter]);

  const handleCheckOut = (id: string) => {
    checkOut.mutate(id);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground mt-1">Track member attendance quickly and accurately.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDateFilter("today")}>
            Today&apos;s Attendance
          </Button>
          <Button onClick={() => setIsMarkOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Mark Attendance
          </Button>
        </div>
      </div>

      <SummaryCards stats={stats} isLoading={isLoadingStats} />

      <div className="flex flex-col gap-4">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
        
        {isLoadingAttendance ? (
          <div className="flex flex-col items-center justify-center p-24 text-center border rounded-lg bg-card mt-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Loading attendance records...</h3>
          </div>
        ) : filteredAttendances.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No attendance records found"
            description="We couldn't find any records matching your criteria."
          />
        ) : (
          <div className="mt-2">
            <AttendanceTable 
              attendances={filteredAttendances} 
              onCheckOut={handleCheckOut} 
              isCheckingOut={checkOut.isPending} 
            />
          </div>
        )}
      </div>

      <MarkAttendanceModal open={isMarkOpen} onOpenChange={setIsMarkOpen} />
    </div>
  );
}
