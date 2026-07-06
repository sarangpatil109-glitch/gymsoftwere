export interface BodyMeasurement {
  id: string;
  member_id: string;
  record_date: string;
  
  weight?: number;
  height?: number;
  bmi?: number;
  body_fat_percentage?: number;
  muscle_percentage?: number;
  
  chest?: number;
  waist?: number;
  hip?: number;
  shoulders?: number;
  biceps?: number;
  forearm?: number;
  thigh?: number;
  calf?: number;
  neck?: number;
  
  resting_heart_rate?: number;
  blood_pressure?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ProgressPhoto {
  id: string;
  member_id: string;
  record_date: string;
  
  front_url?: string;
  back_url?: string;
  left_url?: string;
  right_url?: string;
  
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

// Payload for creating/updating a BodyMeasurement
export type BodyMeasurementPayload = Omit<BodyMeasurement, 'id' | 'created_at' | 'updated_at'>;

// Payload for creating/updating a ProgressPhoto
export type ProgressPhotoPayload = Omit<ProgressPhoto, 'id' | 'created_at' | 'updated_at'>;
