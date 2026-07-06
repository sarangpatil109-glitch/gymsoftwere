import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { AutomationRule, AutomationTemplate, AutomationLog, AutomationJob } from "@/types/automation";

// --- Rules ---
export function useAutomationRules() {
  return useQuery({
    queryKey: ["automation_rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automation_rules")
        .select("*, template:automation_templates(*)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as AutomationRule[];
    },
  });
}

export function useUpdateAutomationRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AutomationRule> & { id: string }) => {
      const { data, error } = await supabase
        .from("automation_rules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation_rules"] });
    },
  });
}

// --- Templates ---
export function useAutomationTemplates() {
  return useQuery({
    queryKey: ["automation_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automation_templates")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as AutomationTemplate[];
    },
  });
}

export function useUpdateAutomationTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AutomationTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from("automation_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation_templates"] });
    },
  });
}

// --- Logs ---
export function useAutomationLogs() {
  return useQuery({
    queryKey: ["automation_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automation_logs")
        .select("*, rule:automation_rules(name)")
        .order("executed_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as AutomationLog[];
    },
  });
}

// --- Jobs (Metrics) ---
export function useAutomationMetrics() {
  return useQuery({
    queryKey: ["automation_metrics"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0] + "T00:00:00Z";
      
      const { count: executionsToday, error: err1 } = await supabase
        .from("automation_logs")
        .select("*", { count: "exact", head: true })
        .gte("executed_at", today);

      const { count: pendingJobs, error: err2 } = await supabase
        .from("automation_jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING");

      const { count: failedJobs, error: err3 } = await supabase
        .from("automation_jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "FAILED");
        
      const { count: totalLogs, error: err4 } = await supabase
        .from("automation_logs")
        .select("*", { count: "exact", head: true });
        
      const { count: successLogs, error: err5 } = await supabase
        .from("automation_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "SUCCESS");

      const successRate = totalLogs && totalLogs > 0 ? Math.round(((successLogs || 0) / totalLogs) * 100) : 100;

      if (err1 || err2 || err3) throw new Error("Failed to fetch metrics");

      return {
        executionsToday: executionsToday || 0,
        pendingJobs: pendingJobs || 0,
        failedJobs: failedJobs || 0,
        successRate
      };
    },
  });
}
