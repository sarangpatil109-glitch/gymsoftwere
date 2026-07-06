-- Migration 05: Fitness Module (Workouts and Diets)

-- 1. Exercise Library
CREATE TABLE IF NOT EXISTS public.exercise_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Chest, Back, Shoulders, Legs, Biceps, Triceps, Core, Cardio, HIIT, CrossFit, Yoga
    difficulty TEXT NOT NULL, -- Beginner, Intermediate, Advanced
    equipment TEXT,
    instructions TEXT,
    default_sets INTEGER,
    default_reps INTEGER,
    default_rest_time TEXT,
    video_url TEXT,
    image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Workout Plans
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT,
    trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Workout Days
CREATE TABLE IF NOT EXISTS public.workout_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL, -- Monday, Tuesday, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Workout Exercises
CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID NOT NULL REFERENCES public.workout_days(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercise_library(id) ON DELETE RESTRICT,
    sets INTEGER,
    reps INTEGER,
    weight TEXT,
    rest_time TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Diet Library
CREATE TABLE IF NOT EXISTS public.diet_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_category TEXT NOT NULL, -- Breakfast, Snack, Lunch, Pre Workout, Post Workout, Dinner
    food_name TEXT NOT NULL,
    quantity TEXT,
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    water_intake TEXT,
    supplements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Diet Plans
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
    daily_calories INTEGER,
    protein_target INTEGER,
    carbs_target INTEGER,
    fat_target INTEGER,
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Diet Plan Meals
CREATE TABLE IF NOT EXISTS public.diet_plan_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
    diet_library_id UUID NOT NULL REFERENCES public.diet_library(id) ON DELETE RESTRICT,
    day_of_week TEXT, -- Optional, if they want specific days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plan_meals ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Access for now based on GymOS setup)
CREATE POLICY "Enable all for exercise_library" ON public.exercise_library FOR ALL USING (true);
CREATE POLICY "Enable all for workout_plans" ON public.workout_plans FOR ALL USING (true);
CREATE POLICY "Enable all for workout_days" ON public.workout_days FOR ALL USING (true);
CREATE POLICY "Enable all for workout_exercises" ON public.workout_exercises FOR ALL USING (true);
CREATE POLICY "Enable all for diet_library" ON public.diet_library FOR ALL USING (true);
CREATE POLICY "Enable all for diet_plans" ON public.diet_plans FOR ALL USING (true);
CREATE POLICY "Enable all for diet_plan_meals" ON public.diet_plan_meals FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_plans_member_id ON public.workout_plans(member_id);
CREATE INDEX IF NOT EXISTS idx_workout_days_plan_id ON public.workout_days(plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_day_id ON public.workout_exercises(day_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_member_id ON public.diet_plans(member_id);
CREATE INDEX IF NOT EXISTS idx_diet_plan_meals_plan_id ON public.diet_plan_meals(plan_id);
