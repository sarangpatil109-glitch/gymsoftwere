import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/paymentMethodService";
import { toast } from "sonner";

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment_methods"],
    queryFn: () => paymentMethodService.getAllMethods(),
  });
}

export function useEnabledPaymentMethods() {
  return useQuery({
    queryKey: ["payment_methods", "enabled"],
    queryFn: () => paymentMethodService.getEnabledMethods(),
  });
}

export function useTogglePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) => 
      paymentMethodService.toggleMethod(id, isEnabled),
    onSuccess: () => {
      toast.success("Payment method updated");
      queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
    },
    onError: (err) => toast.error("Failed to update method", { description: err.message }),
  });
}
