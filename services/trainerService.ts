import { supabase } from "@/lib/supabase";
import { Trainer } from "@/types/settings";
import { TrainerFormValues } from "@/validation/settingsSchema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDbTrainer = (db: any): Trainer => ({
  id: db.id,
  photoUrl: db.photo_url,
  fullName: db.full_name,
  phone: db.phone,
  email: db.email,
  specialization: db.specialization,
  experienceYears: db.experience_years,
  joiningDate: db.joining_date,
  status: db.status,
});

export const trainerService = {
  async getAllTrainers(): Promise<Trainer[]> {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(fromDbTrainer);
  },

  async getActiveTrainers(): Promise<Trainer[]> {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("status", "Active")
      .order("full_name", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(fromDbTrainer);
  },

  async saveTrainer(data: TrainerFormValues, photoUrl?: string, id?: string): Promise<Trainer> {
    const dbData: Record<string, unknown> = {
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      specialization: data.specialization,
      experience_years: data.experienceYears,
      joining_date: data.joiningDate,
      status: data.status,
    };

    if (photoUrl) dbData.photo_url = photoUrl;

    if (id) {
      const { data: result, error } = await supabase
        .from("trainers")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return fromDbTrainer(result);
    } else {
      const { data: result, error } = await supabase
        .from("trainers")
        .insert([dbData])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return fromDbTrainer(result);
    }
  },

  async deleteTrainer(id: string): Promise<void> {
    const { error } = await supabase.from("trainers").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  
  async uploadPhoto(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `trainer_${Math.random()}.${fileExt}`;
    const filePath = `trainers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};
