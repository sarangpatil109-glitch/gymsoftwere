import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";
import { toast } from "sonner";
import { Member } from "@/types/member";

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => memberService.deleteMember(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["members"] });
      const previousMembers = queryClient.getQueryData<Member[]>(["members"]);

      if (previousMembers) {
        queryClient.setQueryData<Member[]>(["members"], 
          previousMembers.filter(m => m.id !== id)
        );
      }
      return { previousMembers };
    },
    onError: (err, id, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["members"], context.previousMembers);
      }
      toast.error("Failed to delete member", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onSuccess: () => {
      toast.success("Member deleted successfully!");
    },
  });
}
