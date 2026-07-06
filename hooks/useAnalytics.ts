import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['analytics', 'dashboard-kpis'],
    queryFn: () => analyticsService.getDashboardKPIs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMonthlyRevenueTrend(limit?: number) {
  return useQuery({
    queryKey: ['analytics', 'monthly-revenue', limit],
    queryFn: () => analyticsService.getMonthlyRevenue(limit),
    staleTime: 30 * 60 * 1000, 
  });
}

export function useDailyAttendanceTrend(limit?: number) {
  return useQuery({
    queryKey: ['analytics', 'daily-attendance', limit],
    queryFn: () => analyticsService.getDailyAttendance(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMemberGrowthTrend(limit?: number) {
  return useQuery({
    queryKey: ['analytics', 'member-growth', limit],
    queryFn: () => analyticsService.getMemberGrowth(limit),
    staleTime: 30 * 60 * 1000,
  });
}

export function useMembershipDistribution() {
  return useQuery({
    queryKey: ['analytics', 'membership-distribution'],
    queryFn: () => analyticsService.getMembershipDistribution(),
    staleTime: 30 * 60 * 1000,
  });
}

export function usePaymentMethodsDistribution() {
  return useQuery({
    queryKey: ['analytics', 'payment-methods'],
    queryFn: () => analyticsService.getPaymentMethodsDistribution(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useExpiringMemberships() {
  return useQuery({
    queryKey: ['analytics', 'expiring-memberships'],
    queryFn: () => analyticsService.getExpiringMemberships(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: ['analytics', 'pending-payments'],
    queryFn: () => analyticsService.getPendingPayments(),
    staleTime: 5 * 60 * 1000,
  });
}
