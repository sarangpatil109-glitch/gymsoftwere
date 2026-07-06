-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id TEXT UNIQUE NOT NULL,
    photo_url TEXT,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT NOT NULL,
    address TEXT,
    emergency_contact TEXT,
    height DECIMAL NOT NULL,
    weight DECIMAL NOT NULL,
    bmi DECIMAL NOT NULL,
    goal TEXT NOT NULL,
    joining_date DATE NOT NULL,
    membership_type TEXT NOT NULL,
    membership_amount DECIMAL NOT NULL,
    discount DECIMAL NOT NULL,
    final_amount DECIMAL NOT NULL,
    payment_status TEXT NOT NULL,
    membership_expiry DATE NOT NULL,
    medical_conditions TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (we will allow all access since there is no auth)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (No Login System)
CREATE POLICY "Enable read access for all users" ON public.members FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.members FOR DELETE USING (true);

-- Create member_id auto-increment sequence and trigger
CREATE SEQUENCE IF NOT EXISTS member_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.member_id IS NULL OR NEW.member_id = '' THEN
        NEW.member_id := 'GM' || LPAD(nextval('member_id_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_member_id
    BEFORE INSERT ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION generate_member_id();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


-- Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('member-photos', 'member-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for member-photos bucket (Public access)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'member-photos');
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'member-photos');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'member-photos');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'member-photos');

-- Create Indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_members_full_name ON public.members (full_name);
CREATE INDEX IF NOT EXISTS idx_members_mobile ON public.members (mobile);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members (email);
