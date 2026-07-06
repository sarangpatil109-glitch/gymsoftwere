"use client";

import { useMemberRealtime } from "@/hooks/useMemberRealtime";

export function MemberRealtimeSync({ memberId, memberUuid }: { memberId: string, memberUuid?: string }) {
  useMemberRealtime(memberId, memberUuid);
  return null;
}
