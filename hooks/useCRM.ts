import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crmService } from "@/services/crmService";
import { Lead, LeadFollowup, LeadTrial, LeadNote, LeadStage } from "@/types/crm";
import { toast } from "sonner";
import { dispatchAutomationEvent } from "@/services/automation";

// --- LEADS ---
export function useLeads() {
  return useQuery({
    queryKey: ["crm_leads"],
    queryFn: () => crmService.getLeads(),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["crm_lead", id],
    queryFn: () => crmService.getLeadById(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lead: Partial<Lead>) => crmService.createLead(lead),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm_leads"] });
      toast.success("Lead created successfully");
      
      // Automations Integration
      dispatchAutomationEvent("NEW_LEAD", { memberId: data.id });
    },
    onError: (err) => {
      toast.error("Failed to create lead", { description: err.message });
    }
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lead> }) => 
      crmService.updateLead(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm_leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm_lead", data.id] });
      toast.success("Lead updated successfully");
    },
    onError: (err) => {
      toast.error("Failed to update lead", { description: err.message });
    }
  });
}

export function useUpdateLeadStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) => 
      crmService.updateLeadStage(id, stage),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: ["crm_leads"] });
      const previousLeads = queryClient.getQueryData<Lead[]>(["crm_leads"]);
      
      if (previousLeads) {
        queryClient.setQueryData<Lead[]>(
          ["crm_leads"],
          previousLeads.map(lead => lead.id === id ? { ...lead, stage } : lead)
        );
      }
      return { previousLeads };
    },
    onError: (err, variables, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(["crm_leads"], context.previousLeads);
      }
      toast.error("Failed to update stage", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["crm_leads"] });
    }
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => crmService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm_leads"] });
      toast.success("Lead deleted");
    },
    onError: (err) => {
      toast.error("Failed to delete lead", { description: err.message });
    }
  });
}

// --- FOLLOWUPS ---
export function useFollowups(leadId?: string) {
  return useQuery({
    queryKey: ["crm_followups", leadId],
    queryFn: () => crmService.getLeadFollowups(leadId),
  });
}

export function useCreateFollowup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followup: Partial<LeadFollowup>) => crmService.createFollowup(followup),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm_followups", data.leadId] });
      queryClient.invalidateQueries({ queryKey: ["crm_followups", undefined] });
      toast.success("Follow-up added");
    },
    onError: (err) => {
      toast.error("Failed to add follow-up", { description: err.message });
    }
  });
}

export function useUpdateFollowup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<LeadFollowup> }) => 
      crmService.updateFollowup(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm_followups", data.leadId] });
      queryClient.invalidateQueries({ queryKey: ["crm_followups", undefined] });
    },
  });
}

// --- TRIALS ---
export function useTrials(leadId?: string) {
  return useQuery({
    queryKey: ["crm_trials", leadId],
    queryFn: () => crmService.getLeadTrials(leadId),
  });
}

export function useCreateTrial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trial: Partial<LeadTrial>) => crmService.createTrial(trial),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm_trials", data.leadId] });
      queryClient.invalidateQueries({ queryKey: ["crm_trials", undefined] });
      toast.success("Trial scheduled successfully");
    },
    onError: (err) => {
      toast.error("Failed to schedule trial", { description: err.message });
    }
  });
}

export function useUpdateTrial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<LeadTrial> }) => 
      crmService.updateTrial(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm_trials", data.leadId] });
      queryClient.invalidateQueries({ queryKey: ["crm_trials", undefined] });
      toast.success("Trial updated");
      
      // If trial missed, trigger automation
      if (data.status === "Missed") {
        dispatchAutomationEvent("TRIAL_MISSED", { memberId: data.leadId }); // Context treats memberId as generic entityId for now
      }
    },
  });
}

// --- NOTES ---
export function useLeadNotes(leadId: string) {
  return useQuery({
    queryKey: ["crm_notes", leadId],
    queryFn: () => crmService.getLeadNotes(leadId),
    enabled: !!leadId,
  });
}

export function useCreateLeadNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note: Partial<LeadNote>) => crmService.createNote(note),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crm_notes", data.leadId] });
    },
    onError: (err) => {
      toast.error("Failed to add note", { description: err.message });
    }
  });
}
