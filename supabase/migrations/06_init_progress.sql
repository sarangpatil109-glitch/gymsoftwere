-- Migration: 06_init_progress
-- Description: Creates body measurements and progress photos tables, and storage bucket.

-- 1. Create Body Measurements Table
CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    bmi NUMERIC(4,2),
    body_fat_percentage NUMERIC(4,2),
    muscle_percentage NUMERIC(4,2),
    
    chest NUMERIC(5,2),
    waist NUMERIC(5,2),
    hip NUMERIC(5,2),
    shoulders NUMERIC(5,2),
    biceps NUMERIC(5,2),
    forearm NUMERIC(5,2),
    thigh NUMERIC(5,2),
    calf NUMERIC(5,2),
    neck NUMERIC(5,2),
    
    resting_heart_rate INTEGER,
    blood_pressure TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying measurements by member and date
CREATE INDEX IF NOT EXISTS idx_body_measurements_member_id ON public.body_measurements(member_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_record_date ON public.body_measurements(record_date DESC);

-- Enable RLS
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users on body_measurements"
    ON public.body_measurements FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Create Progress Photos Table
CREATE TABLE IF NOT EXISTS public.progress_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    front_url TEXT,
    back_url TEXT,
    left_url TEXT,
    right_url TEXT,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying photos by member and date
CREATE INDEX IF NOT EXISTS idx_progress_photos_member_id ON public.progress_photos(member_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_record_date ON public.progress_photos(record_date DESC);

-- Enable RLS
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for authenticated users on progress_photos"
    ON public.progress_photos FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Create Storage Bucket for Progress Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('progress-photos', 'progress-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Policies
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'progress-photos');

CREATE POLICY "Authenticated Insert" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'progress-photos');

CREATE POLICY "Authenticated Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'progress-photos');

CREATE POLICY "Authenticated Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'progress-photos');
