import { supabase } from "@/lib/supabase";
import { Payment, PaymentWithDetails, PaymentStats } from "@/types/payment";
import { PaymentFormValues } from "@/validation/paymentSchema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDbPayment = (db: any): Payment => ({
  id: db.id,
  paymentNumber: db.payment_number,
  receiptNumber: db.receipt_number,
  membershipId: db.membership_id,
  memberId: db.member_id,
  paymentDate: db.payment_date,
  amountPaid: db.amount_paid,
  paymentMethod: db.payment_method,
  transactionReference: db.transaction_reference,
  discount: db.discount,
  balanceAmount: db.balance_amount,
  status: db.status,
  remarks: db.remarks,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const paymentService = {
  async receivePayment(data: PaymentFormValues): Promise<Payment> {
    // 1. Fetch membership to calculate balance
    const { data: membership, error: memError } = await supabase
      .from("memberships")
      .select("*")
      .eq("id", data.membershipId)
      .single();

    if (memError || !membership) throw new Error("Membership not found");

    // 2. Calculate balance
    // The previous balance is either final_amount if this is the first payment, 
    // or we'd have to sum all previous payments.
    // For simplicity, we assume one payment per membership, or we calculate total paid so far.
    const { data: previousPayments } = await supabase
      .from("payments")
      .select("amount_paid, discount")
      .eq("membership_id", data.membershipId);
      
    let totalPaidSoFar = 0;
    if (previousPayments) {
      totalPaidSoFar = previousPayments.reduce((acc, p) => acc + Number(p.amount_paid) + Number(p.discount), 0);
    }
    
    // total amount to clear = membership.final_amount
    const balanceAmount = Number(membership.final_amount) - (totalPaidSoFar + data.amountPaid + data.discount);
    
    const paymentStatus = balanceAmount <= 0 ? "Paid" : "Partial";

    // 3. Insert Payment
    const { data: payment, error: payError } = await supabase
      .from("payments")
      .insert({
        membership_id: data.membershipId,
        member_id: data.memberId,
        amount_paid: data.amountPaid,
        payment_method: data.paymentMethod,
        transaction_reference: data.transactionReference,
        discount: data.discount,
        balance_amount: balanceAmount < 0 ? 0 : balanceAmount,
        status: paymentStatus,
        remarks: data.remarks,
      })
      .select()
      .single();

    if (payError) throw new Error(payError.message);

    // 4. Update Membership status
    await supabase.from("memberships").update({
      payment_status: paymentStatus
    }).eq("id", data.membershipId);

    // 5. Update Member status
    await supabase.from("members").update({
      payment_status: paymentStatus
    }).eq("id", data.memberId);

    return fromDbPayment(payment);
  },

  async getAllPayments(): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        members:member_id (*),
        memberships:membership_id (*)
      `)
      .order("payment_date", { ascending: false });

    if (error) throw new Error(error.message);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      ...fromDbPayment(item),
      member: {
        id: item.members.id,
        memberId: item.members.member_id,
        fullName: item.members.full_name,
        photoUrl: item.members.photo_url || "",
        membershipType: item.members.membership_type,
        mobileNumber: item.members.mobile,
        email: item.members.email,
        status: new Date(item.members.membership_expiry) >= new Date() ? "Active" : "Expired",
        // filling rest with dummies to satisfy type
        gender: item.members.gender, dateOfBirth: item.members.date_of_birth, age: item.members.age,
        height: item.members.height, weight: item.members.weight, bmi: item.members.bmi, goal: item.members.goal,
        joiningDate: item.members.joining_date, amount: item.members.membership_amount,
        discount: item.members.discount, finalAmount: item.members.final_amount, paymentStatus: item.members.payment_status,
        expiryDate: item.members.membership_expiry
      },
      membership: {
        id: item.memberships.id,
        memberId: item.memberships.member_id,
        membershipType: item.memberships.membership_type,
        startDate: item.memberships.start_date,
        expiryDate: item.memberships.expiry_date,
        amount: item.memberships.amount,
        discount: item.memberships.discount,
        finalAmount: item.memberships.final_amount,
        status: item.memberships.status,
        paymentStatus: item.memberships.payment_status,
      }
    }));
  },

  async getMemberPayments(memberId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("member_id", memberId)
      .order("payment_date", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(fromDbPayment);
  },

  async getPaymentStats(): Promise<PaymentStats> {
    const todayDate = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Today's collection
    const { data: todayData } = await supabase
      .from("payments")
      .select("amount_paid")
      .gte("payment_date", todayDate);

    const todayRevenue = todayData?.reduce((acc, curr) => acc + Number(curr.amount_paid), 0) || 0;

    // Monthly collection
    const { data: monthData } = await supabase
      .from("payments")
      .select("amount_paid")
      .gte("payment_date", firstDayOfMonth);

    const monthlyRevenue = monthData?.reduce((acc, curr) => acc + Number(curr.amount_paid), 0) || 0;

    // Total revenue
    const { data: totalData } = await supabase
      .from("payments")
      .select("amount_paid");
    
    const totalRevenue = totalData?.reduce((acc, curr) => acc + Number(curr.amount_paid), 0) || 0;

    // Pending amount (Sum of final_amount from active memberships minus sum of payments for those memberships)
    // For simplicity, we just sum balance_amount of the LATEST payment for each membership, 
    // OR just fetch active memberships where payment_status != 'Paid'
    const { data: pendingMemberships } = await supabase
      .from("memberships")
      .select("id, final_amount")
      .in("payment_status", ["Pending", "Partial"]);

    let pendingAmount = 0;
    if (pendingMemberships) {
      for (const m of pendingMemberships) {
        const { data: p } = await supabase
          .from("payments")
          .select("amount_paid, discount")
          .eq("membership_id", m.id);
        const paidSoFar = p?.reduce((acc, curr) => acc + Number(curr.amount_paid) + Number(curr.discount), 0) || 0;
        pendingAmount += (Number(m.final_amount) - paidSoFar);
      }
    }

    return {
      todayRevenue,
      monthlyRevenue,
      pendingAmount,
      totalRevenue
    };
  },

  async getPaymentById(id: string): Promise<PaymentWithDetails> {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        members:member_id (*),
        memberships:membership_id (*)
      `)
      .eq("id", id)
      .single();

    if (error || !data) throw new Error("Payment not found");
    
    const item = data;
    return {
      ...fromDbPayment(item),
      member: {
        id: item.members.id,
        memberId: item.members.member_id,
        fullName: item.members.full_name,
        photoUrl: item.members.photo_url || "",
        membershipType: item.members.membership_type,
        mobileNumber: item.members.mobile,
        email: item.members.email,
        status: new Date(item.members.membership_expiry) >= new Date() ? "Active" : "Expired",
        gender: item.members.gender, dateOfBirth: item.members.date_of_birth, age: item.members.age,
        height: item.members.height, weight: item.members.weight, bmi: item.members.bmi, goal: item.members.goal,
        joiningDate: item.members.joining_date, amount: item.members.membership_amount,
        discount: item.members.discount, finalAmount: item.members.final_amount, paymentStatus: item.members.payment_status,
        expiryDate: item.members.membership_expiry
      },
      membership: {
        id: item.memberships.id,
        memberId: item.memberships.member_id,
        membershipType: item.memberships.membership_type,
        startDate: item.memberships.start_date,
        expiryDate: item.memberships.expiry_date,
        amount: item.memberships.amount,
        discount: item.memberships.discount,
        finalAmount: item.memberships.final_amount,
        status: item.memberships.status,
        paymentStatus: item.memberships.payment_status,
      }
    };
  }
};
