import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { toast } from "sonner";

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attendanceService.checkOut(id),
    onSuccess: () => {
      toast.success("Successfully checked out!");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
    },
    onError: (err) => {
      toast.error("Failed to check out", { description: err.message });
    }
  });
}
