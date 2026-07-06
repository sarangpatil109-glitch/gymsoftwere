-- 1. Settings Table (Gym Profile & System Preferences + Future Expansion)
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- e.g., 'gym_profile', 'system_preferences'
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Membership Plans Table
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name TEXT NOT NULL,
    duration TEXT NOT NULL, -- Monthly, Quarterly, Half Yearly, Yearly
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    final_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    display_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Trainers Table
CREATE TABLE IF NOT EXISTS public.trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_url TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    specialization TEXT,
    experience_years INTEGER DEFAULT 0,
    joining_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active', -- Active, Inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Payment Methods Table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    method_name TEXT UNIQUE NOT NULL, -- Cash, UPI, Card, Bank Transfer, Cheque, Other
    is_enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Receipt Settings Table
CREATE TABLE IF NOT EXISTS public.receipt_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_header TEXT,
    receipt_footer TEXT,
    authorized_signature_text TEXT DEFAULT 'Authorized Signature',
    gst_number TEXT,
    receipt_prefix TEXT DEFAULT 'PAY',
    receipt_starting_number INTEGER DEFAULT 1,
    logo_position TEXT DEFAULT 'Left', -- Left, Center, Right
    print_size TEXT DEFAULT 'A4', -- A4, Thermal 80mm, Thermal 58mm
    auto_receipt_number BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Theme Settings Table
CREATE TABLE IF NOT EXISTS public.theme_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_color TEXT DEFAULT '#3b82f6',
    sidebar_color TEXT DEFAULT '#1e293b',
    dark_mode BOOLEAN DEFAULT false,
    gym_logo_url TEXT,
    favicon_url TEXT,
    software_title TEXT DEFAULT 'GymOS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all new tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (open for now)
CREATE POLICY "Enable all access for settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for membership_plans" ON public.membership_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for trainers" ON public.trainers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for payment_methods" ON public.payment_methods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for receipt_settings" ON public.receipt_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for theme_settings" ON public.theme_settings FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_settings_category ON public.settings (category);
CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON public.membership_plans (is_active);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON public.trainers (status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_enabled ON public.payment_methods (is_enabled);

-- Insert Default Payment Methods
INSERT INTO public.payment_methods (method_name, display_order) VALUES 
('Cash', 1), ('UPI', 2), ('Card', 3), ('Bank Transfer', 4), ('Cheque', 5), ('Other', 6)
ON CONFLICT (method_name) DO NOTHING;

-- Insert Default Membership Plans
INSERT INTO public.membership_plans (plan_name, duration, price, final_price, color, display_order, is_default) VALUES 
('Monthly Plan', 'Monthly', 1000, 1000, '#3b82f6', 1, true),
('Quarterly Plan', 'Quarterly', 2500, 2500, '#10b981', 2, false),
('Half Yearly Plan', 'Half Yearly', 4500, 4500, '#f59e0b', 3, false),
('Yearly Plan', 'Yearly', 8000, 8000, '#8b5cf6', 4, false);

-- Insert Default Receipt Settings
INSERT INTO public.receipt_settings (receipt_header, receipt_footer) VALUES 
('Welcome to GymOS', 'Thank you for your payment!');

-- Insert Default Theme Settings
INSERT INTO public.theme_settings (primary_color, software_title) VALUES 
('#3b82f6', 'GymOS');

-- Insert Default Settings (Gym Profile)
INSERT INTO public.settings (category, key, value) VALUES 
('gym_profile', 'profile', '{"gymName": "GymOS", "ownerName": "", "mobile": "", "email": "", "website": "", "gstNumber": "", "address": "", "city": "", "state": "", "country": "", "pincode": "", "timezone": "Asia/Kolkata", "currency": "INR", "businessHours": "", "socialMedia": {}}'::jsonb),
('system_preferences', 'preferences', '{"dateFormat": "DD/MM/YYYY", "currencySymbol": "₹", "weightUnit": "Kg", "heightUnit": "Cm", "timeFormat": "12 Hour", "language": "English"}'::jsonb);

