import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";
import { ReportFilters } from "@/types/report";

export function useRevenueReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ['reports', 'revenue', filters],
    queryFn: () => reportService.getRevenueReport(filters),
    staleTime: 5 * 60 * 1000, 
  });
}

export function useMembershipReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ['reports', 'membership', filters],
    queryFn: () => reportService.getMembershipReport(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAttendanceReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ['reports', 'attendance', filters],
    queryFn: () => reportService.getAttendanceReport(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMemberGrowthReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ['reports', 'member-growth', filters],
    queryFn: () => reportService.getMemberGrowthReport(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrainerReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ['reports', 'trainer', filters],
    queryFn: () => reportService.getTrainerReport(filters),
    staleTime: 5 * 60 * 1000,
  });
}
