export interface DashboardKPIs {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  todayAttendance: number;
  monthlyRevenue: number;
  pendingPayments: number;
  expiringMemberships: number;
  avgDailyAttendance: number;
}

export interface MonthlyRevenueData {
  month: string;
  total_revenue: number;
}

export interface DailyAttendanceData {
  date: string;
  total_attendances: number;
}

export interface MemberGrowthData {
  month: string;
  new_members: number;
}

export interface MembershipDistributionData {
  membership_type: string;
  total_count: number;
}

export interface PaymentMethodData {
  payment_method: string;
  transaction_count: number;
  total_amount: number;
}

export interface ExpiringMembershipData {
  membership_id: string;
  member_id: string;
  membership_type: string;
  expiry_date: string;
  status: string;
  full_name: string;
  mobile_number: string;
}

export interface PendingPaymentData {
  membership_id: string;
  member_id: string;
  membership_type: string;
  final_amount: number;
  total_paid: number;
  pending_amount: number;
  full_name: string;
  mobile_number: string;
}
