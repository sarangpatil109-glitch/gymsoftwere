import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";

export function useAttendance(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["attendance", startDate, endDate],
    queryFn: () => attendanceService.getAttendances(startDate, endDate),
  });
}

export function useAttendanceStats() {
  return useQuery({
    queryKey: ["attendance-stats"],
    queryFn: () => attendanceService.getTodayStats(),
    refetchInterval: 60000, // Refresh stats every minute automatically
  });
}

export function useMemberAttendanceHistory(memberId: string) {
  return useQuery({
    queryKey: ["attendance-history", memberId],
    queryFn: () => attendanceService.getMemberHistory(memberId),
    enabled: !!memberId,
  });
}
