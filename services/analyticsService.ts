import { supabase } from "@/lib/supabase";
import { 
  DashboardKPIs, 
  MonthlyRevenueData, 
  DailyAttendanceData, 
  MemberGrowthData, 
  MembershipDistributionData, 
  PaymentMethodData, 
  ExpiringMembershipData, 
  PendingPaymentData 
} from "@/types/analytics";

export const analyticsService = {
  // Fetch Dashboard KPIs
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const today = new Date().toISOString().split('T')[0];
    
    // Total Members
    const { count: totalMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true });

    // Active Members
    const { count: activeMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active');

    // Inactive Members
    const { count: inactiveMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'Active');

    // Today's Attendance
    const { count: todayAttendance } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('attendance_date', today)
      .eq('status', 'Present');

    // Monthly Revenue (from view)
    const { data: monthlyRevenueData } = await supabase
      .from('vw_monthly_revenue')
      .select('total_revenue')
      .limit(1);

    // Pending Payments (count from view)
    const { count: pendingPayments } = await supabase
      .from('vw_pending_payments')
      .select('*', { count: 'exact', head: true });

    // Expiring Memberships (count from view)
    const { count: expiringMemberships } = await supabase
      .from('vw_expiring_memberships')
      .select('*', { count: 'exact', head: true });

    // Avg Daily Attendance (calculated over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: last30DaysAttendance } = await supabase
      .from('vw_daily_attendance')
      .select('total_attendances')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
      
    let avgDailyAttendance = 0;
    if (last30DaysAttendance && last30DaysAttendance.length > 0) {
      const total = last30DaysAttendance.reduce((sum, item) => sum + Number(item.total_attendances), 0);
      avgDailyAttendance = Math.round(total / last30DaysAttendance.length);
    }

    return {
      totalMembers: totalMembers || 0,
      activeMembers: activeMembers || 0,
      inactiveMembers: inactiveMembers || 0,
      todayAttendance: todayAttendance || 0,
      monthlyRevenue: monthlyRevenueData?.[0]?.total_revenue || 0,
      pendingPayments: pendingPayments || 0,
      expiringMemberships: expiringMemberships || 0,
      avgDailyAttendance: avgDailyAttendance,
    };
  },

  async getMonthlyRevenue(limit: number = 12): Promise<MonthlyRevenueData[]> {
    const { data, error } = await supabase
      .from('vw_monthly_revenue')
      .select('*')
      .limit(limit)
      .order('month', { ascending: true }); // Ascending for charts

    if (error) throw error;
    return data || [];
  },

  async getDailyAttendance(limit: number = 30): Promise<DailyAttendanceData[]> {
    const { data, error } = await supabase
      .from('vw_daily_attendance')
      .select('*')
      .limit(limit)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getMemberGrowth(limit: number = 12): Promise<MemberGrowthData[]> {
    const { data, error } = await supabase
      .from('vw_member_growth')
      .select('*')
      .limit(limit)
      .order('month', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getMembershipDistribution(): Promise<MembershipDistributionData[]> {
    const { data, error } = await supabase
      .from('vw_membership_distribution')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async getPaymentMethodsDistribution(): Promise<PaymentMethodData[]> {
    const { data, error } = await supabase
      .from('vw_payment_methods')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async getExpiringMemberships(): Promise<ExpiringMembershipData[]> {
    const { data, error } = await supabase
      .from('vw_expiring_memberships')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async getPendingPayments(): Promise<PendingPaymentData[]> {
    const { data, error } = await supabase
      .from('vw_pending_payments')
      .select('*');

    if (error) throw error;
    return data || [];
  }
};
