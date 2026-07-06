import { useQuery } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: () => memberService.getMembers(),
  });
}
