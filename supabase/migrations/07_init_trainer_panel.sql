-- Migration: 07_init_trainer_panel
-- Description: Creates trainer_assignments table to link members to trainers.

CREATE TABLE IF NOT EXISTS public.trainer_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Active', -- Active, Inactive
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Unique constraint: A member can only have one active trainer at a time (optional, but good for data integrity if it fits the model)
-- For now we just create a unique index on member + trainer to avoid duplicate assignment rows for the same pair.
-- Actually, a member could be assigned and reassigned. So we just ensure a member has only ONE active trainer.
CREATE UNIQUE INDEX IF NOT EXISTS idx_trainer_assignments_active_member ON public.trainer_assignments(member_id) WHERE status = 'Active';

CREATE INDEX IF NOT EXISTS idx_trainer_assignments_trainer_id ON public.trainer_assignments(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_assignments_member_id ON public.trainer_assignments(member_id);

-- Enable RLS
ALTER TABLE public.trainer_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for authenticated users on trainer_assignments"
    ON public.trainer_assignments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
