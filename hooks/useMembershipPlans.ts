import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipPlanService } from "@/services/membershipPlanService";
import { MembershipPlanFormValues } from "@/validation/settingsSchema";
import { toast } from "sonner";

export function useMembershipPlans() {
  return useQuery({
    queryKey: ["membership_plans"],
    queryFn: () => membershipPlanService.getAllPlans(),
  });
}

export function useActiveMembershipPlans() {
  return useQuery({
    queryKey: ["membership_plans", "active"],
    queryFn: () => membershipPlanService.getActivePlans(),
  });
}

export function useSaveMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: MembershipPlanFormValues; id?: string }) => 
      membershipPlanService.savePlan(data, id),
    onSuccess: () => {
      toast.success("Membership plan saved successfully");
      queryClient.invalidateQueries({ queryKey: ["membership_plans"] });
    },
    onError: (err) => toast.error("Failed to save plan", { description: err.message }),
  });
}

export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => membershipPlanService.deletePlan(id),
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["membership_plans"] });
    },
    onError: (err) => toast.error("Failed to delete plan", { description: err.message }),
  });
}

export function useToggleMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      membershipPlanService.togglePlanStatus(id, isActive),
    onSuccess: () => {
      toast.success("Plan status updated");
      queryClient.invalidateQueries({ queryKey: ["membership_plans"] });
    },
    onError: (err) => toast.error("Failed to update status", { description: err.message }),
  });
}
