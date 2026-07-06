import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export function useMemberRealtime(memberId: string, memberUuid?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!memberId) return;

    const invalidateMemberData = () => {
      // String ID based keys
      queryClient.invalidateQueries({ queryKey: ['portalMember', memberId] });
      queryClient.invalidateQueries({ queryKey: ['portalMemberBySlug'] });
      queryClient.invalidateQueries({ queryKey: ['portalMembership', memberId] });
      queryClient.invalidateQueries({ queryKey: ['portalAttendance', memberId] });
      queryClient.invalidateQueries({ queryKey: ['portalWorkout', memberId] });
      queryClient.invalidateQueries({ queryKey: ['portalDiet', memberId] });
      queryClient.invalidateQueries({ queryKey: ['portalProgress', memberId] });
      queryClient.invalidateQueries({ queryKey: ['portalPhotos', memberId] });
      queryClient.invalidateQueries({ queryKey: ['portalPayments', memberId] });
      
      // UUID based keys
      if (memberUuid) {
        queryClient.invalidateQueries({ queryKey: ["attendance-history", memberUuid] });
        queryClient.invalidateQueries({ queryKey: ["payments-member", memberUuid] });
      }
    };

    // Filter using string member_id where applicable
    const channel = supabase
      .channel(`member_portal_${memberId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members', filter: `member_id=eq.${memberId}` },
        invalidateMemberData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'memberships', filter: `member_id=eq.${memberId}` },
        invalidateMemberData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workouts', filter: `member_id=eq.${memberId}` },
        invalidateMemberData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'diets', filter: `member_id=eq.${memberId}` },
        invalidateMemberData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'progress_records', filter: `member_id=eq.${memberId}` },
        invalidateMemberData
      );

    // Filter using UUID where applicable
    if (memberUuid) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance', filter: `member_id=eq.${memberUuid}` },
        invalidateMemberData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `member_id=eq.${memberUuid}` },
        invalidateMemberData
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memberId, memberUuid, queryClient]);
}
