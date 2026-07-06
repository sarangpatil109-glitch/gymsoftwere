import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trainerService } from "@/services/trainerService";
import { TrainerFormValues } from "@/validation/settingsSchema";
import { toast } from "sonner";

export function useTrainers() {
  return useQuery({
    queryKey: ["trainers"],
    queryFn: () => trainerService.getAllTrainers(),
  });
}

export function useActiveTrainers() {
  return useQuery({
    queryKey: ["trainers", "active"],
    queryFn: () => trainerService.getActiveTrainers(),
  });
}

export function useSaveTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, photoUrl, id }: { data: TrainerFormValues; photoUrl?: string; id?: string }) => 
      trainerService.saveTrainer(data, photoUrl, id),
    onSuccess: () => {
      toast.success("Trainer saved successfully");
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
    onError: (err) => toast.error("Failed to save trainer", { description: err.message }),
  });
}

export function useDeleteTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trainerService.deleteTrainer(id),
    onSuccess: () => {
      toast.success("Trainer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
    onError: (err) => toast.error("Failed to delete trainer", { description: err.message }),
  });
}
