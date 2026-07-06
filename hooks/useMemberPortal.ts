import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  DEMO_MEMBER, DEMO_MEMBERSHIP, DEMO_ATTENDANCE, 
  DEMO_WORKOUT, DEMO_DIET, DEMO_PROGRESS, 
  DEMO_PHOTOS, DEMO_PAYMENTS 
} from "@/utils/demoMemberData";

const isDev = process.env.NODE_ENV === "development";

export function usePortalMember(memberId: string) {
  return useQuery({
    queryKey: ['portalMember', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('member_id', memberId)
        .single();
      
      if ((error || !data) && isDev) return DEMO_MEMBER;
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },
    enabled: !!memberId,
  });
}

export function usePortalMemberBySlug(slug: string) {
  return useQuery({
    queryKey: ['portalMemberBySlug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .or(`member_slug.eq.${slug},member_id.eq.${slug}`)
        .single();
        
      if ((error || !data) && isDev) {
        return {
          ...DEMO_MEMBER,
          member_slug: slug
        };
      }
        
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },
    enabled: !!slug,
  });
}

export function useUpdatePortalMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portalMember', data.member_id] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to update profile"),
  });
}

export function usePortalMembership(memberId: string) {
  return useQuery({
    queryKey: ['portalMembership', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memberships')
        .select(`
          *,
          plan:membership_plans(*)
        `)
        .eq('member_id', memberId)
        .eq('status', 'ACTIVE')
        .single();
        
      if ((error && error.code !== 'PGRST116' || !data) && isDev && memberId === DEMO_MEMBER.member_id) {
        return DEMO_MEMBERSHIP;
      }
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows
      return data || null;
    },
    enabled: !!memberId,
  });
}

export function usePortalAttendance(memberId: string) {
  return useQuery({
    queryKey: ['portalAttendance', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('member_id', memberId)
        .order('check_in', { ascending: false });
      
      if ((error || !data || data.length === 0) && isDev && memberId === DEMO_MEMBER.member_id) {
        return DEMO_ATTENDANCE;
      }
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memberId,
  });
}

export function usePortalWorkout(memberId: string) {
  return useQuery({
    queryKey: ['portalWorkout', memberId],
    queryFn: async () => {
      // Find the most recently assigned active workout
      const { data: workout, error: wError } = await supabase
        .from('workouts')
        .select('*')
        .eq('member_id', memberId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if ((wError && wError.code !== 'PGRST116' || !workout) && isDev && memberId === DEMO_MEMBER.member_id) {
        return DEMO_WORKOUT;
      }
      
      if (wError && wError.code !== 'PGRST116') throw wError;
      if (!workout) return null;

      const { data: exercises, error: eError } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('workout_id', workout.id)
        .order('order_index', { ascending: true });
        
      if (eError && isDev && memberId === DEMO_MEMBER.member_id) return DEMO_WORKOUT;
      if (eError) throw eError;
      
      return { ...workout, exercises: exercises || [] };
    },
    enabled: !!memberId,
  });
}

export function useCompleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ exerciseId, completed }: { exerciseId: string, completed: boolean }) => {
      // For this demo, we'll just pretend it works for the UI.
      return { exerciseId, completed };
    },
    onSuccess: () => {
      toast.success("Exercise marked as completed!");
    }
  });
}

export function usePortalDiet(memberId: string) {
  return useQuery({
    queryKey: ['portalDiet', memberId],
    queryFn: async () => {
      const { data: diet, error: dError } = await supabase
        .from('diets')
        .select('*')
        .eq('member_id', memberId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if ((dError && dError.code !== 'PGRST116' || !diet) && isDev && memberId === DEMO_MEMBER.member_id) {
        return DEMO_DIET;
      }
      
      if (dError && dError.code !== 'PGRST116') throw dError;
      if (!diet) return null;

      const { data: meals, error: mError } = await supabase
        .from('diet_meals')
        .select('*')
        .eq('diet_id', diet.id)
        .order('time', { ascending: true });
        
      if (mError && isDev && memberId === DEMO_MEMBER.member_id) return DEMO_DIET;
      if (mError) throw mError;
      
      return { ...diet, meals: meals || [] };
    },
    enabled: !!memberId,
  });
}

export function usePortalProgress(memberId: string) {
  return useQuery({
    queryKey: ['portalProgress', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_records')
        .select('*')
        .eq('member_id', memberId)
        .order('date', { ascending: true });
        
      if ((error || !data || data.length === 0) && isDev && memberId === DEMO_MEMBER.member_id) {
        return DEMO_PROGRESS;
      }
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memberId,
  });
}

export function usePortalPhotos(memberId: string) {
  return useQuery({
    queryKey: ['portalPhotos', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('member_id', memberId)
        .order('date', { ascending: false });
        
      if ((error || !data || data.length === 0) && isDev && memberId === DEMO_MEMBER.member_id) {
        return DEMO_PHOTOS;
      }
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memberId,
  });
}

export function usePortalPayments(memberId: string) {
  return useQuery({
    queryKey: ['portalPayments', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', memberId)
        .order('payment_date', { ascending: false });
        
      if ((error || !data || data.length === 0) && isDev && memberId === DEMO_MEMBER.member_id) {
        return DEMO_PAYMENTS;
      }
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memberId,
  });
}
