import { supabase } from '@/lib/supabase';
import { BodyMeasurement, BodyMeasurementPayload, ProgressPhoto, ProgressPhotoPayload } from '@/types/progress';

export const progressService = {
  // --- Body Measurements ---
  async getMemberMeasurements(memberId: string): Promise<BodyMeasurement[]> {
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('member_id', memberId)
      .order('record_date', { ascending: true }); // Ascending for charts usually

    if (error) throw error;
    return data || [];
  },

  async addMeasurement(payload: BodyMeasurementPayload): Promise<BodyMeasurement> {
    const { data, error } = await supabase
      .from('body_measurements')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMeasurement(id: string, payload: Partial<BodyMeasurementPayload>): Promise<BodyMeasurement> {
    const { data, error } = await supabase
      .from('body_measurements')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMeasurement(id: string): Promise<void> {
    const { error } = await supabase
      .from('body_measurements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // --- Progress Photos ---
  async getMemberPhotos(memberId: string): Promise<ProgressPhoto[]> {
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('member_id', memberId)
      .order('record_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addProgressPhoto(payload: ProgressPhotoPayload): Promise<ProgressPhoto> {
    const { data, error } = await supabase
      .from('progress_photos')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProgressPhoto(id: string): Promise<void> {
    const { error } = await supabase
      .from('progress_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // --- Storage ---
  async uploadPhotoFile(memberId: string, file: File, type: 'front' | 'back' | 'left' | 'right'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${memberId}/${Date.now()}_${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
};
