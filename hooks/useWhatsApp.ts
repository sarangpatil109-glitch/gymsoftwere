import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whatsappService } from "@/services/whatsappService";
import { WhatsAppTemplate, AutomationRule, SendWhatsAppMessagePayload } from "@/types/whatsapp";
import { toast } from "sonner";

// Templates
export function useWhatsAppTemplates() {
  return useQuery({
    queryKey: ['whatsappTemplates'],
    queryFn: () => whatsappService.getTemplates(),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (template: Partial<WhatsAppTemplate>) => whatsappService.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappTemplates'] });
      toast.success("Template created successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to create template"),
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, template }: { id: string, template: Partial<WhatsAppTemplate> }) => whatsappService.updateTemplate(id, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappTemplates'] });
      toast.success("Template updated successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to update template"),
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => whatsappService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappTemplates'] });
      toast.success("Template deleted successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete template"),
  });
}

// Automation Rules
export function useAutomationRules() {
  return useQuery({
    queryKey: ['automationRules'],
    queryFn: () => whatsappService.getAutomationRules(),
  });
}

export function useUpdateAutomationRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<AutomationRule> }) => whatsappService.updateAutomationRule(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
      toast.success("Automation rule updated");
    },
    onError: (error: any) => toast.error(error.message || "Failed to update rule"),
  });
}

// Logs
export function useWhatsAppLogs() {
  return useQuery({
    queryKey: ['whatsappLogs'],
    queryFn: () => whatsappService.getLogs(),
    refetchInterval: 5000, // Refetch every 5s to see simulated status updates
  });
}

export function useSendWhatsAppMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendWhatsAppMessagePayload) => whatsappService.sendMockMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappLogs'] });
      toast.success("Message queued successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to send message"),
  });
}

export function useRetryFailedMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logId: string) => whatsappService.retryFailedMessage(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappLogs'] });
      toast.success("Message requeued successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to retry message"),
  });
}
