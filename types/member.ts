export type MembershipType = string;
export type MemberStatus = "Active" | "Expired" | "Pending";
export type FitnessGoal = "Weight Loss" | "Weight Gain" | "Muscle Gain" | "Fitness" | "Bodybuilding";
export type PaymentStatus = "Paid" | "Partial" | "Pending";
export type Gender = "Male" | "Female" | "Other";

export interface Member {
  id: string; // UUID primary key
  memberId?: string; // Generated GM000001
  memberSlug?: string; // Generated slug e.g. sarang-patil
  portalUrl?: string; // Generated portal URL
  
  // Personal Information
  photoUrl?: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string; // ISO date string YYYY-MM-DD
  age: number; // Auto calculated
  mobileNumber: string;
  whatsappNumber?: string;
  email: string;
  address?: string;
  emergencyContact?: string;

  // Body Details
  height: number; // in cm
  weight: number; // in kg
  bmi: number; // Auto calculated
  goal: FitnessGoal;

  // Membership
  joiningDate: string; // ISO date string YYYY-MM-DD
  membershipType: MembershipType;
  amount: number;
  discount: number;
  finalAmount: number; // Auto calculated
  paymentStatus: PaymentStatus;
  expiryDate: string; // Auto calculated YYYY-MM-DD
  status: MemberStatus; // Derived based on expiryDate or manual

  // Extra
  medicalConditions?: string;
  notes?: string;
}
