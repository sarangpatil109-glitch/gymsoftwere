export type LeadStage = "New" | "Contacted" | "Interested" | "Trial Scheduled" | "Trial Completed" | "Negotiation" | "Joined" | "Lost";
export type LeadSource = "Walk-In" | "Facebook" | "Instagram" | "Google" | "Website" | "WhatsApp" | "Reference" | "Other";
export type FollowUpStatus = "Interested" | "Call Back" | "Busy" | "No Answer" | "Not Interested" | "Joined";
export type TrialStatus = "Scheduled" | "Attended" | "Missed" | "Rescheduled" | "Completed";
export type FitnessGoal = "Weight Loss" | "Weight Gain" | "Muscle Gain" | "Fitness" | "Bodybuilding" | string;

export interface Lead {
  id: string;
  photoUrl?: string;
  fullName: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  gender: string;
  age?: number;
  address?: string;
  occupation?: string;
  fitnessGoal?: FitnessGoal;
  leadSource?: LeadSource;
  budget?: number;
  preferredBatch?: string;
  trainerPreference?: string;
  medicalConditions?: string;
  notes?: string;
  stage: LeadStage;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadFollowup {
  id: string;
  leadId: string;
  followupDate: string; // YYYY-MM-DD
  time?: string; // HH:mm
  status: FollowUpStatus;
  notes?: string;
  nextFollowupDate?: string;
  createdAt?: string;
  
  // Joined relation
  lead?: Lead;
}

export interface LeadTrial {
  id: string;
  leadId: string;
  trialDate: string; // YYYY-MM-DD
  time?: string; // HH:mm
  trainerId?: string; // Storing trainer name or ID
  workoutType?: string;
  status: TrialStatus;
  createdAt?: string;
  updatedAt?: string;
  
  // Joined relation
  lead?: Lead;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt?: string;
}
