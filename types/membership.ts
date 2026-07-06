import { Member } from "./member";

export type MembershipType = string;
export type MembershipStatus = "Active" | "Expired" | "Cancelled" | "Renewed";
export type PaymentStatus = "Paid" | "Partial" | "Pending";

export interface Membership {
  id: string; // UUID
  memberId: string;
  membershipType: MembershipType;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  amount: number;
  discount: number;
  finalAmount: number;
  amountPaid?: number;
  status: MembershipStatus;
  paymentStatus: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface MembershipWithMember extends Membership {
  member: Member;
}
