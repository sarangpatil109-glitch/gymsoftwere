import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";
import { toast } from "sonner";
import { Member } from "@/types/member";

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, member }: { id: string; member: Partial<Member> }) => 
      memberService.updateMember(id, member),
    onMutate: async ({ id, member }) => {
      await queryClient.cancelQueries({ queryKey: ["members"] });
      const previousMembers = queryClient.getQueryData<Member[]>(["members"]);

      if (previousMembers) {
        queryClient.setQueryData<Member[]>(["members"], 
          previousMembers.map(m => m.id === id ? { ...m, ...member } as Member : m)
        );
      }
      return { previousMembers };
    },
    onError: (err, variables, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["members"], context.previousMembers);
      }
      toast.error("Failed to update member", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onSuccess: () => {
      toast.success("Member updated successfully!");
    },
  });
}
