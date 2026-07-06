import { supabase } from '@/lib/supabase';
import { Trainer, TrainerAssignment } from '@/types/trainer-panel';
import { Member } from '@/types/member';

export const trainerPanelService = {
  // --- Trainers ---
  async getTrainers(): Promise<Trainer[]> {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // --- Assignments ---
  async getAssignedMembers(trainerId: string): Promise<TrainerAssignment[]> {
    const { data, error } = await supabase
      .from('trainer_assignments')
      .select(`
        *,
        member:members(*)
      `)
      .eq('trainer_id', trainerId)
      .eq('status', 'Active')
      .order('assigned_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async assignMember(trainerId: string, memberId: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('trainer_assignments')
      .upsert(
        { trainer_id: trainerId, member_id: memberId, status: 'Active', notes },
        { onConflict: 'member_id' } // Upsert based on the unique index we created for active assignments
      );
      
    if (error) throw error;
  },

  async removeAssignment(assignmentId: string): Promise<void> {
    const { error } = await supabase
      .from('trainer_assignments')
      .update({ status: 'Inactive' })
      .eq('id', assignmentId);

    if (error) throw error;
  },

  // --- Dashboard Analytics ---
  async getDashboardStats(trainerId: string) {
    const assignments = await this.getAssignedMembers(trainerId);
    const memberIds = assignments.map(a => a.member_id);
    
    let todaysAttendance = 0;
    let pendingWorkouts = 0;
    let pendingDietPlans = 0;

    if (memberIds.length > 0) {
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's attendance for assigned members
      const { count: attendanceCount, error: attError } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .in('member_id', memberIds)
        .eq('date', today)
        .eq('status', 'Present');
      
      if (!attError && attendanceCount) todaysAttendance = attendanceCount;

      // Fetch active workout plans
      const { data: workouts, error: workError } = await supabase
        .from('workout_plans')
        .select('member_id')
        .in('member_id', memberIds)
        .gte('end_date', today)
        .lte('start_date', today);

      if (!workError) {
        const membersWithWorkouts = new Set(workouts?.map(w => w.member_id));
        pendingWorkouts = memberIds.filter(id => !membersWithWorkouts.has(id)).length;
      }

      // Fetch active diet plans
      const { data: diets, error: dietError } = await supabase
        .from('diet_plans')
        .select('member_id')
        .in('member_id', memberIds)
        .gte('end_date', today)
        .lte('start_date', today);
        
      if (!dietError) {
        const membersWithDiets = new Set(diets?.map(d => d.member_id));
        pendingDietPlans = memberIds.filter(id => !membersWithDiets.has(id)).length;
      }
    }

    return {
      assignedMembers: memberIds.length,
      todaysAttendance,
      pendingWorkouts,
      pendingDietPlans,
    };
  }
};
