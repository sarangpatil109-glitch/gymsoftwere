import { supabase } from "@/lib/supabase";
import { Attendance, AttendanceWithMember, AttendanceStats, AttendanceSource } from "@/types/attendance";

// Helper to map DB to UI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDbAttendance = (db: any): Attendance => {
  return {
    id: db.id,
    memberId: db.member_id,
    attendanceDate: db.attendance_date,
    checkInTime: db.check_in_time,
    checkOutTime: db.check_out_time,
    status: db.status,
    source: db.source,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
};

export const attendanceService = {
  // Get attendance records with member details
  // Optional date filtering
  async getAttendances(startDate?: string, endDate?: string): Promise<AttendanceWithMember[]> {
    let query = supabase
      .from("attendance")
      .select(`
        *,
        members:member_id (*)
      `)
      .order("check_in_time", { ascending: false });

    if (startDate) {
      query = query.gte("attendance_date", startDate);
    }
    if (endDate) {
      query = query.lte("attendance_date", endDate);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    // Map to camelCase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      ...fromDbAttendance(item),
      member: {
        id: item.members.id,
        memberId: item.members.member_id,
        fullName: item.members.full_name,
        photoUrl: item.members.photo_url || "",
        membershipType: item.members.membership_type,
        mobileNumber: item.members.mobile,
        email: item.members.email,
        status: new Date(item.members.membership_expiry) >= new Date() ? "Active" : "Expired",
        // fill required fields to satisfy type but typically UI only needs the above
        gender: item.members.gender,
        dateOfBirth: item.members.date_of_birth,
        age: item.members.age,
        height: item.members.height,
        weight: item.members.weight,
        bmi: item.members.bmi,
        goal: item.members.goal,
        joiningDate: item.members.joining_date,
        amount: item.members.membership_amount,
        discount: item.members.discount,
        finalAmount: item.members.final_amount,
        paymentStatus: item.members.payment_status,
        expiryDate: item.members.membership_expiry,
      }
    }));
  },

  async checkIn(memberId: string, source: AttendanceSource = "Manual"): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    
    // The DB constraint UNIQUE(member_id, attendance_date) will handle duplicates naturally,
    // but we can catch it and format the error nicely.
    
    const { data, error } = await supabase
      .from("attendance")
      .insert({
        member_id: memberId,
        attendance_date: today,
        status: "Present",
        source: source,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation code in Postgres
        throw new Error("Member already checked in today.");
      }
      throw new Error(error.message);
    }

    return fromDbAttendance(data);
  },

  async checkOut(id: string): Promise<Attendance> {
    const { data, error } = await supabase
      .from("attendance")
      .update({ check_out_time: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromDbAttendance(data);
  },

  async getTodayStats(): Promise<AttendanceStats> {
    const today = new Date().toISOString().split('T')[0];
    
    // Get all present today
    const { count: presentCount, error: presentError } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("attendance_date", today);

    if (presentError) throw new Error(presentError.message);

    // Get total members
    const { count: totalMembers, error: totalError } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true });

    if (totalError) throw new Error(totalError.message);

    const present = presentCount || 0;
    const total = totalMembers || 0;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      present,
      absent,
      total,
      percentage
    };
  },

  async getMemberHistory(memberId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("member_id", memberId)
      .order("attendance_date", { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(fromDbAttendance);
  }
};
