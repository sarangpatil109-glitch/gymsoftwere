import { supabase } from "@/lib/supabase";
import { DietFood, DietPlan, DietPlanMeal } from "@/types/fitness";

export const dietService = {
  // DIET LIBRARY (FOODS)
  async getDietFoods() {
    const { data, error } = await supabase
      .from("diet_library")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as DietFood[];
  },

  async createDietFood(food: Partial<DietFood>) {
    const { data, error } = await supabase
      .from("diet_library")
      .insert(food)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as DietFood;
  },

  async updateDietFood(id: string, food: Partial<DietFood>) {
    const { data, error } = await supabase
      .from("diet_library")
      .update(food)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as DietFood;
  },

  async deleteDietFood(id: string) {
    const { error } = await supabase
      .from("diet_library")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  },

  // DIET PLANS
  async getDietPlans(memberId?: string) {
    let query = supabase.from("diet_plans").select(`
      *,
      meals:diet_plan_meals (
        *,
        food:diet_library (*)
      )
    `).order("created_at", { ascending: false });

    if (memberId) {
      query = query.eq("member_id", memberId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as unknown as DietPlan[];
  },

  async createDietPlan(plan: Partial<DietPlan>, meals: Partial<DietPlanMeal>[]) {
    // 1. Create plan
    const { data: newPlan, error: planError } = await supabase
      .from("diet_plans")
      .insert({
        member_id: plan.member_id,
        trainer_id: plan.trainer_id,
        daily_calories: plan.daily_calories,
        protein_target: plan.protein_target,
        carbs_target: plan.carbs_target,
        fat_target: plan.fat_target,
        start_date: plan.start_date,
        end_date: plan.end_date,
        notes: plan.notes,
      })
      .select()
      .single();

    if (planError) throw new Error(planError.message);

    // 2. Create meals
    if (meals && meals.length > 0) {
      const mealsToInsert = meals.map(m => ({
        plan_id: newPlan.id,
        diet_library_id: m.diet_library_id,
        day_of_week: m.day_of_week,
      }));

      const { error: mealsError } = await supabase
        .from("diet_plan_meals")
        .insert(mealsToInsert);

      if (mealsError) {
        console.error("Failed to insert meals:", mealsError);
      }
    }

    return newPlan;
  },

  async deleteDietPlan(id: string) {
    const { error } = await supabase
      .from("diet_plans")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }
};
