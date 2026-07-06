import { supabase } from "@/lib/supabase";
import { ReportFilters } from "@/types/report";
import { Member } from "@/types/member";
import { Membership } from "@/types/membership";
import { Payment } from "@/types/payment";
import { Attendance } from "@/types/attendance";
import { Trainer } from "@/types/settings";

export const reportService = {
  
  async getRevenueReport(filters: ReportFilters): Promise<Payment[]> {
    let query = supabase
      .from('payments')
      .select('*, members(full_name), memberships(membership_type)')
      .order('payment_date', { ascending: false });

    if (filters.dateRange?.from) {
      query = query.gte('payment_date', filters.dateRange.from.toISOString().split('T')[0]);
    }
    if (filters.dateRange?.to) {
      query = query.lte('payment_date', filters.dateRange.to.toISOString().split('T')[0]);
    }
    if (filters.searchQuery) {
      query = query.ilike('members.full_name', `%${filters.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Client side filter for related tables if needed, because Supabase ilike on joined tables filters the child object to null if it doesn't match, rather than filtering out the parent row.
    let finalData = data as Record<string, unknown>[];
    if (filters.searchQuery) {
      finalData = finalData.filter(row => row.members !== null);
    }
    if (filters.membershipType) {
      finalData = finalData.filter(row => (row.memberships as Record<string, unknown>)?.membership_type === filters.membershipType);
    }

    return finalData as unknown as Payment[];
  },

  async getMembershipReport(filters: ReportFilters): Promise<Membership[]> {
    let query = supabase
      .from('memberships')
      .select('*, members(full_name, mobile_number, email)')
      .order('created_at', { ascending: false });

    if (filters.dateRange?.from) {
      query = query.gte('start_date', filters.dateRange.from.toISOString().split('T')[0]);
    }
    if (filters.dateRange?.to) {
      query = query.lte('start_date', filters.dateRange.to.toISOString().split('T')[0]);
    }
    if (filters.membershipType) {
      query = query.eq('membership_type', filters.membershipType);
    }
    if (filters.paymentStatus) {
      query = query.eq('payment_status', filters.paymentStatus);
    }
    if (filters.searchQuery) {
      query = query.ilike('members.full_name', `%${filters.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    let finalData = data as Record<string, unknown>[];
    if (filters.searchQuery) {
      finalData = finalData.filter(row => row.members !== null);
    }

    return finalData as unknown as Membership[];
  },

  async getAttendanceReport(filters: ReportFilters): Promise<Attendance[]> {
    let query = supabase
      .from('attendance')
      .select('*, members(full_name, mobile_number)')
      .order('attendance_date', { ascending: false });

    if (filters.dateRange?.from) {
      query = query.gte('attendance_date', filters.dateRange.from.toISOString().split('T')[0]);
    }
    if (filters.dateRange?.to) {
      query = query.lte('attendance_date', filters.dateRange.to.toISOString().split('T')[0]);
    }
    if (filters.searchQuery) {
      query = query.ilike('members.full_name', `%${filters.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    let finalData = data as Record<string, unknown>[];
    if (filters.searchQuery) {
      finalData = finalData.filter(row => row.members !== null);
    }

    return finalData as unknown as Attendance[];
  },

  async getMemberGrowthReport(filters: ReportFilters): Promise<Member[]> {
    let query = supabase
      .from('members')
      .select('*')
      .order('joining_date', { ascending: false });

    if (filters.dateRange?.from) {
      query = query.gte('joining_date', filters.dateRange.from.toISOString().split('T')[0]);
    }
    if (filters.dateRange?.to) {
      query = query.lte('joining_date', filters.dateRange.to.toISOString().split('T')[0]);
    }
    if (filters.searchQuery) {
      query = query.or(`full_name.ilike.%${filters.searchQuery}%,mobile_number.ilike.%${filters.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getTrainerReport(filters: ReportFilters): Promise<Trainer[]> {
    let query = supabase
      .from('trainers')
      .select('*')
      .order('full_name', { ascending: true });

    if (filters.searchQuery) {
      query = query.or(`full_name.ilike.%${filters.searchQuery}%,phone.ilike.%${filters.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
};
