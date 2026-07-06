import { Member } from "./member";
import { Membership, PaymentStatus } from "./membership";

export type PaymentMethod = "Cash" | "UPI" | "Card" | "Bank Transfer" | "Other";

export interface Payment {
  id: string; // UUID
  paymentNumber: string; // PAY000001
  receiptNumber: string; // PAY000001
  membershipId: string;
  memberId: string;
  paymentDate: string; // ISO DateTime
  amountPaid: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  discount: number;
  balanceAmount: number;
  status: PaymentStatus;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentWithDetails extends Payment {
  member: Member;
  membership: Membership;
}

export interface PaymentStats {
  todayRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  totalRevenue: number;
}
