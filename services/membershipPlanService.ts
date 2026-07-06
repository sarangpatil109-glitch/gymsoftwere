import { supabase } from "@/lib/supabase";
import { MembershipPlan } from "@/types/settings";
import { MembershipPlanFormValues } from "@/validation/settingsSchema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDbPlan = (db: any): MembershipPlan => ({
  id: db.id,
  planName: db.plan_name,
  duration: db.duration,
  price: db.price,
  discount: db.discount,
  finalPrice: db.final_price,
  description: db.description,
  color: db.color,
  displayOrder: db.display_order,
  isDefault: db.is_default,
  isActive: db.is_active,
});

export const membershipPlanService = {
  async getAllPlans(): Promise<MembershipPlan[]> {
    const { data, error } = await supabase
      .from("membership_plans")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(fromDbPlan);
  },

  async getActivePlans(): Promise<MembershipPlan[]> {
    const { data, error } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(fromDbPlan);
  },

  async savePlan(data: MembershipPlanFormValues, id?: string): Promise<MembershipPlan> {
    const dbData = {
      plan_name: data.planName,
      duration: data.duration,
      price: data.price,
      discount: data.discount,
      final_price: data.finalPrice,
      description: data.description,
      color: data.color,
      display_order: data.displayOrder,
      is_default: data.isDefault,
      is_active: data.isActive,
    };

    if (id) {
      const { data: result, error } = await supabase
        .from("membership_plans")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return fromDbPlan(result);
    } else {
      const { data: result, error } = await supabase
        .from("membership_plans")
        .insert([dbData])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return fromDbPlan(result);
    }
  },

  async deletePlan(id: string): Promise<void> {
    const { error } = await supabase.from("membership_plans").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  
  async togglePlanStatus(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase.from("membership_plans").update({ is_active: isActive }).eq("id", id);
    if (error) throw new Error(error.message);
  }
};
