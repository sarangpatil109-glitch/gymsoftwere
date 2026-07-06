import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutService } from "@/services/workoutService";
import { Exercise, WorkoutPlan, WorkoutDay } from "@/types/fitness";
import { toast } from "sonner";
import { dispatchAutomationEvent } from "@/services/automation";

// EXERCISES
export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: () => workoutService.getExercises(),
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exercise: Partial<Exercise>) => workoutService.createExercise(exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Exercise added successfully");
    },
    onError: (err) => {
      toast.error("Failed to add exercise", { description: err.message });
    }
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, exercise }: { id: string; exercise: Partial<Exercise> }) => 
      workoutService.updateExercise(id, exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Exercise updated successfully");
    },
    onError: (err) => {
      toast.error("Failed to update exercise", { description: err.message });
    }
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutService.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Exercise deleted successfully");
    },
    onError: (err) => {
      toast.error("Failed to delete exercise", { description: err.message });
    }
  });
}

// WORKOUT PLANS
export function useWorkoutPlans(memberId?: string) {
  return useQuery({
    queryKey: ["workout_plans", memberId],
    queryFn: () => workoutService.getWorkoutPlans(memberId),
  });
}

export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ plan, days }: { plan: Partial<WorkoutPlan>, days: Partial<WorkoutDay>[] }) => 
      workoutService.createWorkoutPlan(plan, days),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workout_plans"] });
      if (variables.plan.member_id) {
        queryClient.invalidateQueries({ queryKey: ["workout_plans", variables.plan.member_id] });
        dispatchAutomationEvent('WORKOUT_ASSIGNED', {
          memberId: variables.plan.member_id,
          workoutId: data?.id,
          trainerName: variables.plan.trainer_id // or better, lookup trainer name.
        });
      }
      toast.success("Workout plan assigned successfully");
    },
    onError: (err) => {
      toast.error("Failed to assign workout plan", { description: err.message });
    }
  });
}

export function useDeleteWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutService.deleteWorkoutPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout_plans"] });
      toast.success("Workout plan deleted successfully");
    },
    onError: (err) => {
      toast.error("Failed to delete workout plan", { description: err.message });
    }
  });
}
