import { supabase } from "@/lib/supabase";
import { PaymentMethod } from "@/types/settings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDbPaymentMethod = (db: any): PaymentMethod => ({
  id: db.id,
  methodName: db.method_name,
  isEnabled: db.is_enabled,
  displayOrder: db.display_order,
});

export const paymentMethodService = {
  async getAllMethods(): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(fromDbPaymentMethod);
  },

  async getEnabledMethods(): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("is_enabled", true)
      .order("display_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(fromDbPaymentMethod);
  },

  async toggleMethod(id: string, isEnabled: boolean): Promise<void> {
    const { error } = await supabase
      .from("payment_methods")
      .update({ is_enabled: isEnabled })
      .eq("id", id);
      
    if (error) throw new Error(error.message);
  }
};
