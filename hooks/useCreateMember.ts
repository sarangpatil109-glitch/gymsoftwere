import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";
import { toast } from "sonner";
import { Member } from "@/types/member";
import { dispatchAutomationEvent } from "@/services/automation";

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMember: Partial<Member>) => memberService.createMember(newMember),
    onMutate: async (newMember) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["members"] });

      // Snapshot the previous value
      const previousMembers = queryClient.getQueryData<Member[]>(["members"]);

      // Optimistically update to the new value
      if (previousMembers) {
        queryClient.setQueryData<Member[]>(["members"], [
          { ...newMember, id: `optimistic-${Date.now()}`, memberId: "Generating..." } as Member,
          ...previousMembers,
        ]);
      }

      return { previousMembers };
    },
    onError: (err, newMember, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMembers) {
        queryClient.setQueryData(["members"], context.previousMembers);
      }
      toast.error("Failed to add member", { description: err.message });
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onSuccess: (data) => {
      toast.success("Member added successfully!");
      if (data && data.id) {
        dispatchAutomationEvent('MEMBER_CREATED', { memberId: data.id });
      }
    },
  });
}
