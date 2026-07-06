export interface ReportFilters {
  dateRange: { from?: Date; to?: Date };
  membershipType?: string;
  trainer?: string;
  paymentStatus?: string;
  searchQuery?: string;
}

export interface RevenueReportData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface AttendanceReportData {
  member_name: string;
  attendance_date: string;
  check_in: string;
  check_out: string;
  status: string;
}

export interface PaymentReportData {
  payment_id: string;
  member_name: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  status: string;
}

export interface TrainerReportData {
  trainer_name: string;
  active_members: number;
  total_attendance_taken: number;
  rating?: number;
}
