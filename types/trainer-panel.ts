import { Member } from "./member";

export interface Trainer {
  id: string;
  full_name: string;
  photo_url?: string;
  phone: string;
  email?: string;
  specialization?: string;
  experience_years: number;
  joining_date: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface TrainerAssignment {
  id: string;
  trainer_id: string;
  member_id: string;
  assigned_date: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
  // relations
  member?: Member;
  trainer?: Trainer;
}

export interface TrainerDashboardStats {
  assignedMembers: number;
  todaysAttendance: number;
  pendingWorkouts: number; // Members with no active workout plan
  pendingDietPlans: number; // Members with no active diet plan
}
