import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";
import { PaymentFormValues } from "@/validation/paymentSchema";
import { toast } from "sonner";
import { dispatchAutomationEvent } from "@/services/automation";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentService.getAllPayments(),
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ["payment-stats"],
    queryFn: () => paymentService.getPaymentStats(),
    refetchInterval: 60000,
  });
}

export function useMemberPayments(memberId: string) {
  return useQuery({
    queryKey: ["payments-member", memberId],
    queryFn: () => paymentService.getMemberPayments(memberId),
    enabled: !!memberId,
  });
}

export function usePaymentById(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
  });
}

export function useReceivePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentFormValues) => paymentService.receivePayment(data),
    onSuccess: (data) => {
      toast.success("Payment received successfully!");
      if (data && data.memberId) {
        dispatchAutomationEvent('PAYMENT_RECEIVED', { 
          memberId: data.memberId,
          paymentId: data.id,
          receiptLink: typeof window !== 'undefined' ? `${window.location.origin}/member/login` : undefined
        });
      }
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments-member", data.memberId] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
      queryClient.invalidateQueries({ queryKey: ["memberships", data.memberId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err) => {
      toast.error("Failed to process payment", { description: err.message });
    }
  });
}
