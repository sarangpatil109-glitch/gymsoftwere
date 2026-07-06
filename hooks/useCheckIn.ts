import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { toast } from "sonner";
import { AttendanceSource } from "@/types/attendance";

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, source }: { memberId: string; source?: AttendanceSource }) => 
      attendanceService.checkIn(memberId, source),
    onSuccess: () => {
      toast.success("Successfully checked in!");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
    },
    onError: (err) => {
      toast.error("Failed to check in", { description: err.message });
    }
  });
}
