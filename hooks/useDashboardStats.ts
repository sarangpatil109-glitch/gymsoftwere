import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, format, isSameDay, parseISO, startOfDay, endOfDay } from "date-fns";

// 1. Expiring Memberships (0-7 days) & Upcoming Renewals (8-30 days)
export function useDashboardMemberships(daysRangeStart: number, daysRangeEnd: number) {
  return useQuery({
    queryKey: ["dashboard-memberships", daysRangeStart, daysRangeEnd],
    queryFn: async () => {
      const today = new Date();
      const start = addDays(today, daysRangeStart);
      const end = addDays(today, daysRangeEnd);

      const { data, error } = await supabase
        .from("memberships")
        .select(`
          id,
          end_date,
          plan_id,
          member_id,
          status,
          members (
            id,
            first_name,
            last_name,
            phone,
            member_slug
          ),
          membership_plans (
            name
          )
        `)
        .eq("status", "ACTIVE")
        .gte("end_date", format(start, "yyyy-MM-dd"))
        .lte("end_date", format(end, "yyyy-MM-dd"))
        .order("end_date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

// 2. Pending Payments
export function usePendingPaymentsList() {
  return useQuery({
    queryKey: ["dashboard-pending-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          id,
          amount,
          payment_date,
          status,
          member_id,
          members (
            id,
            first_name,
            last_name,
            phone,
            member_slug
          )
        `)
        .eq("status", "PENDING")
        .order("payment_date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

// 3. Today's Birthdays
export function useTodaysBirthdays() {
  return useQuery({
    queryKey: ["dashboard-birthdays"],
    queryFn: async () => {
      // Supabase PostgREST doesn't support complex date extraction directly in JS client easily without raw SQL.
      // We will fetch all active members with a DOB, and filter in JS since gym sizes are typically < 1000.
      const { data, error } = await supabase
        .from("members")
        .select("id, member_id, first_name, last_name, dob, phone, member_slug")
        .eq("status", "ACTIVE")
        .not("dob", "is", null);

      if (error) throw error;
      
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();

      const birthdays = (data || []).filter(member => {
        if (!member.dob) return false;
        const dob = parseISO(member.dob);
        return dob.getMonth() === currentMonth && dob.getDate() === currentDay;
      });

      return birthdays;
    },
  });
}

// 4. Today's New Members
export function useNewMembersToday() {
  return useQuery({
    queryKey: ["dashboard-new-members"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("members")
        .select("id, member_id, first_name, last_name, phone, join_date, member_slug")
        .gte("join_date", today);

      if (error) throw error;
      return data || [];
    },
  });
}

// 5. Members Not Checked In Today
export function useMissingAttendanceToday() {
  return useQuery({
    queryKey: ["dashboard-missing-attendance"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      
      // 1. Get all active members
      const { data: members, error: membersError } = await supabase
        .from("members")
        .select("id, member_id, first_name, last_name, phone, member_slug")
        .eq("status", "ACTIVE");

      if (membersError) throw membersError;
      if (!members || members.length === 0) return [];

      // 2. Get today's check-ins
      const { data: attendances, error: attError } = await supabase
        .from("attendance")
        .select("member_id")
        .gte("check_in", `${today}T00:00:00`)
        .lte("check_in", `${today}T23:59:59`);

      if (attError) throw attError;

      const checkedInIds = new Set((attendances || []).map(a => a.member_id));
      
      // 3. Filter missing
      const missing = members.filter(m => !checkedInIds.has(m.member_id));
      return missing;
    },
  });
}

// 6. Low Stock Inventory
export function useLowStockInventory() {
  return useQuery({
    queryKey: ["dashboard-low-stock"],
    queryFn: async () => {
      // Assuming store_products has a quantity and min_stock fields
      try {
        const { data, error } = await supabase
          .from("store_products")
          .select("*")
          .lte("quantity", 10) // Fallback hardcoded if no min_stock
          .order("quantity", { ascending: true })
          .limit(10);

        if (error) {
           console.warn("Low stock query failed, maybe table doesn't exist yet", error);
           return [];
        }
        return data || [];
      } catch (e) {
        return [];
      }
    },
  });
}

// 7. Today's Trainer Schedule
export function useTodaysTrainerSchedule() {
  return useQuery({
    queryKey: ["dashboard-trainer-schedule"],
    queryFn: async () => {
      // Fetch active trainers and their assigned members
      const { data: trainers, error } = await supabase
        .from("trainers")
        .select(`
          id,
          first_name,
          last_name,
          specialization,
          members:members(id, member_id, first_name, last_name)
        `)
        .eq("status", "ACTIVE");
        
      if (error) {
        console.warn("Trainer query failed", error);
        return [];
      }
      return trainers || [];
    },
  });
}

// 8. Recent Payments
export function useRecentPayments(limit = 5) {
  return useQuery({
    queryKey: ["dashboard-recent-payments", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          id,
          amount,
          payment_date,
          payment_method,
          status,
          members (
            id,
            first_name,
            last_name
          )
        `)
        .eq("status", "PAID")
        .order("payment_date", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
  });
}
