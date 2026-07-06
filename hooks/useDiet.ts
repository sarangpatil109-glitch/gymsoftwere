import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dietService } from "@/services/dietService";
import { DietFood, DietPlan, DietPlanMeal } from "@/types/fitness";
import { toast } from "sonner";
import { dispatchAutomationEvent } from "@/services/automation";

// DIET FOODS
export function useDietFoods() {
  return useQuery({
    queryKey: ["diet_foods"],
    queryFn: () => dietService.getDietFoods(),
  });
}

export function useCreateDietFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (food: Partial<DietFood>) => dietService.createDietFood(food),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diet_foods"] });
      toast.success("Food added successfully");
    },
    onError: (err) => {
      toast.error("Failed to add food", { description: err.message });
    }
  });
}

export function useUpdateDietFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, food }: { id: string; food: Partial<DietFood> }) => 
      dietService.updateDietFood(id, food),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diet_foods"] });
      toast.success("Food updated successfully");
    },
    onError: (err) => {
      toast.error("Failed to update food", { description: err.message });
    }
  });
}

export function useDeleteDietFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dietService.deleteDietFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diet_foods"] });
      toast.success("Food deleted successfully");
    },
    onError: (err) => {
      toast.error("Failed to delete food", { description: err.message });
    }
  });
}

// DIET PLANS
export function useDietPlans(memberId?: string) {
  return useQuery({
    queryKey: ["diet_plans", memberId],
    queryFn: () => dietService.getDietPlans(memberId),
  });
}

export function useCreateDietPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ plan, meals }: { plan: Partial<DietPlan>, meals: Partial<DietPlanMeal>[] }) => 
      dietService.createDietPlan(plan, meals),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diet_plans"] });
      if (variables.plan.member_id) {
        queryClient.invalidateQueries({ queryKey: ["diet_plans", variables.plan.member_id] });
        dispatchAutomationEvent('DIET_ASSIGNED', {
          memberId: variables.plan.member_id,
          dietId: data?.id,
          trainerName: variables.plan.trainer_id // or better, lookup trainer name.
        });
      }
      toast.success("Diet plan assigned successfully");
    },
    onError: (err) => {
      toast.error("Failed to assign diet plan", { description: err.message });
    }
  });
}

export function useDeleteDietPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dietService.deleteDietPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diet_plans"] });
      toast.success("Diet plan deleted successfully");
    },
    onError: (err) => {
      toast.error("Failed to delete diet plan", { description: err.message });
    }
  });
}
