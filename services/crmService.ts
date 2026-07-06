import { supabase } from "@/lib/supabase";
import { Lead, LeadFollowup, LeadTrial, LeadNote, LeadStage } from "@/types/crm";

// LEADS
export const crmService = {
  getLeads: async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    
    return data.map(toCamelCaseLead) as Lead[];
  },

  getLeadById: async (id: string) => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    
    return toCamelCaseLead(data) as Lead;
  },

  createLead: async (lead: Partial<Lead>) => {
    const dbLead = toSnakeCaseLead(lead);
    const { data, error } = await supabase
      .from("leads")
      .insert([dbLead])
      .select()
      .single();
    if (error) throw error;
    
    return toCamelCaseLead(data) as Lead;
  },

  updateLead: async (id: string, updates: Partial<Lead>) => {
    const dbUpdates = toSnakeCaseLead(updates);
    const { data, error } = await supabase
      .from("leads")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    
    return toCamelCaseLead(data) as Lead;
  },

  deleteLead: async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  updateLeadStage: async (id: string, stage: LeadStage) => {
    const { data, error } = await supabase
      .from("leads")
      .update({ stage })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCaseLead(data) as Lead;
  },

  // FOLLOWUPS
  getLeadFollowups: async (leadId?: string) => {
    let query = supabase.from("lead_followups").select("*, lead:leads(*)");
    if (leadId) {
      query = query.eq("lead_id", leadId);
    }
    const { data, error } = await query.order("followup_date", { ascending: true });
    if (error) throw error;
    
    return data.map(f => {
      const camel = toCamelCaseFollowup(f);
      if (f.lead) camel.lead = toCamelCaseLead(f.lead) as Lead;
      return camel;
    }) as LeadFollowup[];
  },

  createFollowup: async (followup: Partial<LeadFollowup>) => {
    const dbFollowup = toSnakeCaseFollowup(followup);
    const { data, error } = await supabase
      .from("lead_followups")
      .insert([dbFollowup])
      .select()
      .single();
    if (error) throw error;
    return toCamelCaseFollowup(data) as LeadFollowup;
  },

  updateFollowup: async (id: string, updates: Partial<LeadFollowup>) => {
    const dbUpdates = toSnakeCaseFollowup(updates);
    const { data, error } = await supabase
      .from("lead_followups")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCaseFollowup(data) as LeadFollowup;
  },

  // TRIALS
  getLeadTrials: async (leadId?: string) => {
    let query = supabase.from("lead_trials").select("*, lead:leads(*)");
    if (leadId) {
      query = query.eq("lead_id", leadId);
    }
    const { data, error } = await query.order("trial_date", { ascending: true });
    if (error) throw error;
    
    return data.map(t => {
      const camel = toCamelCaseTrial(t);
      if (t.lead) camel.lead = toCamelCaseLead(t.lead) as Lead;
      return camel;
    }) as LeadTrial[];
  },

  createTrial: async (trial: Partial<LeadTrial>) => {
    const dbTrial = toSnakeCaseTrial(trial);
    const { data, error } = await supabase
      .from("lead_trials")
      .insert([dbTrial])
      .select()
      .single();
    if (error) throw error;
    return toCamelCaseTrial(data) as LeadTrial;
  },

  updateTrial: async (id: string, updates: Partial<LeadTrial>) => {
    const dbUpdates = toSnakeCaseTrial(updates);
    const { data, error } = await supabase
      .from("lead_trials")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCaseTrial(data) as LeadTrial;
  },

  // NOTES
  getLeadNotes: async (leadId: string) => {
    const { data, error } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    
    return data.map(n => ({
      id: n.id,
      leadId: n.lead_id,
      content: n.content,
      createdAt: n.created_at,
    })) as LeadNote[];
  },

  createNote: async (note: Partial<LeadNote>) => {
    const { data, error } = await supabase
      .from("lead_notes")
      .insert([{ lead_id: note.leadId, content: note.content }])
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      leadId: data.lead_id,
      content: data.content,
      createdAt: data.created_at,
    } as LeadNote;
  }
};

// Utils for Camel <-> Snake Case matching DB columns
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCamelCaseLead(row: any): Partial<Lead> {
  if (!row) return {};
  return {
    id: row.id,
    photoUrl: row.photo_url,
    fullName: row.full_name,
    mobile: row.mobile,
    whatsapp: row.whatsapp,
    email: row.email,
    gender: row.gender,
    age: row.age,
    address: row.address,
    occupation: row.occupation,
    fitnessGoal: row.fitness_goal,
    leadSource: row.lead_source,
    budget: row.budget,
    preferredBatch: row.preferred_batch,
    trainerPreference: row.trainer_preference,
    medicalConditions: row.medical_conditions,
    notes: row.notes,
    stage: row.stage,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnakeCaseLead(lead: Partial<Lead>): any {
  const row: any = {};
  if (lead.fullName !== undefined) row.full_name = lead.fullName;
  if (lead.photoUrl !== undefined) row.photo_url = lead.photoUrl;
  if (lead.mobile !== undefined) row.mobile = lead.mobile;
  if (lead.whatsapp !== undefined) row.whatsapp = lead.whatsapp;
  if (lead.email !== undefined) row.email = lead.email;
  if (lead.gender !== undefined) row.gender = lead.gender;
  if (lead.age !== undefined) row.age = lead.age;
  if (lead.address !== undefined) row.address = lead.address;
  if (lead.occupation !== undefined) row.occupation = lead.occupation;
  if (lead.fitnessGoal !== undefined) row.fitness_goal = lead.fitnessGoal;
  if (lead.leadSource !== undefined) row.lead_source = lead.leadSource;
  if (lead.budget !== undefined) row.budget = lead.budget;
  if (lead.preferredBatch !== undefined) row.preferred_batch = lead.preferredBatch;
  if (lead.trainerPreference !== undefined) row.trainer_preference = lead.trainerPreference;
  if (lead.medicalConditions !== undefined) row.medical_conditions = lead.medicalConditions;
  if (lead.notes !== undefined) row.notes = lead.notes;
  if (lead.stage !== undefined) row.stage = lead.stage;
  return row;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCamelCaseFollowup(row: any): Partial<LeadFollowup> {
  if (!row) return {};
  return {
    id: row.id,
    leadId: row.lead_id,
    followupDate: row.followup_date,
    time: row.time,
    status: row.status,
    notes: row.notes,
    nextFollowupDate: row.next_followup_date,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnakeCaseFollowup(followup: Partial<LeadFollowup>): any {
  const row: any = {};
  if (followup.leadId !== undefined) row.lead_id = followup.leadId;
  if (followup.followupDate !== undefined) row.followup_date = followup.followupDate;
  if (followup.time !== undefined) row.time = followup.time;
  if (followup.status !== undefined) row.status = followup.status;
  if (followup.notes !== undefined) row.notes = followup.notes;
  if (followup.nextFollowupDate !== undefined) row.next_followup_date = followup.nextFollowupDate;
  return row;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCamelCaseTrial(row: any): Partial<LeadTrial> {
  if (!row) return {};
  return {
    id: row.id,
    leadId: row.lead_id,
    trialDate: row.trial_date,
    time: row.time,
    trainerId: row.trainer_id,
    workoutType: row.workout_type,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnakeCaseTrial(trial: Partial<LeadTrial>): any {
  const row: any = {};
  if (trial.leadId !== undefined) row.lead_id = trial.leadId;
  if (trial.trialDate !== undefined) row.trial_date = trial.trialDate;
  if (trial.time !== undefined) row.time = trial.time;
  if (trial.trainerId !== undefined) row.trainer_id = trial.trainerId;
  if (trial.workoutType !== undefined) row.workout_type = trial.workoutType;
  if (trial.status !== undefined) row.status = trial.status;
  return row;
}
