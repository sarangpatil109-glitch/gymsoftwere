export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  equipment?: string;
  instructions?: string;
  default_sets?: number;
  default_reps?: number;
  default_rest_time?: string;
  video_url?: string;
  image_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutExercise {
  id: string;
  day_id: string;
  exercise_id: string;
  sets?: number;
  reps?: number;
  weight?: string;
  rest_time?: string;
  sort_order: number;
  exercise?: Exercise; // joined
}

export interface WorkoutDay {
  id: string;
  plan_id: string;
  day_of_week: string;
  exercises?: WorkoutExercise[]; // joined
}

export interface WorkoutPlan {
  id: string;
  member_id: string;
  name: string;
  goal?: string;
  trainer_id?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  days?: WorkoutDay[]; // joined
}

export interface DietFood {
  id: string;
  meal_category: string;
  food_name: string;
  quantity?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  water_intake?: string;
  supplements?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DietPlanMeal {
  id: string;
  plan_id: string;
  diet_library_id: string;
  day_of_week?: string;
  food?: DietFood; // joined
}

export interface DietPlan {
  id: string;
  member_id: string;
  trainer_id?: string;
  daily_calories?: number;
  protein_target?: number;
  carbs_target?: number;
  fat_target?: number;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  meals?: DietPlanMeal[]; // joined
}
