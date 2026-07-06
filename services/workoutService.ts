import { supabase } from "@/lib/supabase";
import { Exercise, WorkoutPlan, WorkoutDay, WorkoutExercise } from "@/types/fitness";

export const workoutService = {
  // EXERCISES
  async getExercises() {
    const { data, error } = await supabase
      .from("exercise_library")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Exercise[];
  },

  async createExercise(exercise: Partial<Exercise>) {
    const { data, error } = await supabase
      .from("exercise_library")
      .insert(exercise)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Exercise;
  },

  async updateExercise(id: string, exercise: Partial<Exercise>) {
    const { data, error } = await supabase
      .from("exercise_library")
      .update(exercise)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Exercise;
  },

  async deleteExercise(id: string) {
    const { error } = await supabase
      .from("exercise_library")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  },

  // WORKOUT PLANS
  async getWorkoutPlans(memberId?: string) {
    let query = supabase.from("workout_plans").select(`
      *,
      days:workout_days (
        *,
        exercises:workout_exercises (
          *,
          exercise:exercise_library (*)
        )
      )
    `).order("created_at", { ascending: false });

    if (memberId) {
      query = query.eq("member_id", memberId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as unknown as WorkoutPlan[];
  },

  async createWorkoutPlan(plan: Partial<WorkoutPlan>, days: Partial<WorkoutDay>[]) {
    // 1. Create plan
    const { data: newPlan, error: planError } = await supabase
      .from("workout_plans")
      .insert({
        member_id: plan.member_id,
        name: plan.name,
        goal: plan.goal,
        trainer_id: plan.trainer_id,
        start_date: plan.start_date,
        end_date: plan.end_date,
      })
      .select()
      .single();

    if (planError) throw new Error(planError.message);

    // 2. Create days and exercises
    for (const day of days) {
      const { data: newDay, error: dayError } = await supabase
        .from("workout_days")
        .insert({
          plan_id: newPlan.id,
          day_of_week: day.day_of_week,
        })
        .select()
        .single();
      
      if (dayError) continue;

      if (day.exercises && day.exercises.length > 0) {
        const exercisesToInsert = day.exercises.map(ex => ({
          day_id: newDay.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          rest_time: ex.rest_time,
          sort_order: ex.sort_order
        }));

        await supabase.from("workout_exercises").insert(exercisesToInsert);
      }
    }

    return newPlan;
  },

  async deleteWorkoutPlan(id: string) {
    const { error } = await supabase
      .from("workout_plans")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }
};
