-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    check_out_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'Present',
    source TEXT NOT NULL DEFAULT 'Manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(member_id, attendance_date) -- Prevent duplicate check-ins on the same day
);

-- Enable RLS (we will allow all access since there is no auth)
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (No Login System)
CREATE POLICY "Enable read access for all users" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.attendance FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.attendance FOR DELETE USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create Indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance (attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON public.attendance (member_id);
