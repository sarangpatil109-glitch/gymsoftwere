import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipService } from "@/services/membershipService";
import { MembershipFormValues } from "@/validation/membershipSchema";
import { toast } from "sonner";

export function useMemberMemberships(memberId: string) {
  return useQuery({
    queryKey: ["memberships", memberId],
    queryFn: () => membershipService.getMemberMemberships(memberId),
    enabled: !!memberId,
  });
}

export function useExpiringMemberships(days: number = 7) {
  return useQuery({
    queryKey: ["memberships-expiring", days],
    queryFn: () => membershipService.getExpiringMemberships(days),
  });
}

export function useAssignMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MembershipFormValues) => membershipService.assignMembership(data),
    onSuccess: (data) => {
      toast.success("Membership assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["memberships", data.memberId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["memberships-expiring"] });
    },
    onError: (err) => {
      toast.error("Failed to assign membership", { description: err.message });
    }
  });
}
