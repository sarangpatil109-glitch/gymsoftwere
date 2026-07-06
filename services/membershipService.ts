import { supabase } from "@/lib/supabase";
import { Membership, MembershipType } from "@/types/membership";
import { MembershipFormValues } from "@/validation/membershipSchema";
import { addDays, format } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDbMembership = (db: any): Membership => ({
  id: db.id,
  memberId: db.member_id,
  membershipType: db.membership_type,
  startDate: db.start_date,
  expiryDate: db.expiry_date,
  amount: db.amount,
  discount: db.discount,
  finalAmount: db.final_amount,
  status: db.status,
  paymentStatus: db.payment_status,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const membershipService = {
  calculateExpiryDate(startDate: string, type: MembershipType): string {
    const start = new Date(startDate);
    let days = 30;
    if (type === "Quarterly") days = 90;
    if (type === "Half Yearly") days = 180;
    if (type === "Yearly") days = 365;
    
    return format(addDays(start, days), "yyyy-MM-dd");
  },

  async assignMembership(data: MembershipFormValues): Promise<Membership> {
    const expiryDate = this.calculateExpiryDate(data.startDate, data.membershipType);
    
    // Status is 'Active' initially. paymentStatus will be 'Pending' initially until payment is made
    const { data: result, error } = await supabase
      .from("memberships")
      .insert({
        member_id: data.memberId,
        membership_type: data.membershipType,
        start_date: data.startDate,
        expiry_date: expiryDate,
        amount: data.amount,
        discount: data.discount,
        final_amount: data.finalAmount,
        status: "Active",
        payment_status: "Pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Update the member's membership_type and membership_expiry in the members table to keep it synced
    await supabase.from("members").update({
      membership_type: data.membershipType,
      membership_expiry: expiryDate,
      membership_amount: data.amount,
      discount: data.discount,
      final_amount: data.finalAmount,
      payment_status: "Pending"
    }).eq("id", data.memberId);

    return fromDbMembership(result);
  },

  async getMemberMemberships(memberId: string): Promise<Membership[]> {
    const { data, error } = await supabase
      .from("memberships")
      .select("*")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(fromDbMembership);
  },

  async getExpiringMemberships(days: number = 7): Promise<number> {
    const today = new Date();
    const future = addDays(today, days);
    
    const { count, error } = await supabase
      .from("memberships")
      .select("*", { count: 'exact', head: true })
      .eq("status", "Active")
      .gte("expiry_date", format(today, "yyyy-MM-dd"))
      .lte("expiry_date", format(future, "yyyy-MM-dd"));

    if (error) throw new Error(error.message);
    return count || 0;
  }
};
