-- 08_init_whatsapp.sql

CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- e.g., 'MARKETING', 'UTILITY', 'AUTHENTICATION'
  language TEXT NOT NULL DEFAULT 'en_US',
  content TEXT NOT NULL,
  variables JSONB, -- stores an array of expected variable names like ['name', 'date']
  status TEXT NOT NULL DEFAULT 'PENDING', -- 'APPROVED', 'PENDING', 'REJECTED'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL UNIQUE, -- e.g., 'MEMBER_JOINED', 'PAYMENT_RECEIVED'
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  message_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whatsapp_templates_modtime
BEFORE UPDATE ON public.whatsapp_templates
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_automation_rules_modtime
BEFORE UPDATE ON public.automation_rules
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_whatsapp_logs_modtime
BEFORE UPDATE ON public.whatsapp_logs
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Seed some default templates for GymOS
INSERT INTO public.whatsapp_templates (name, category, language, content, variables, status) VALUES
('Welcome Message', 'MARKETING', 'en', 'Welcome to GymOS, {{1}}! We are thrilled to have you. Let''s crush your goals together.', '["Member Name"]', 'APPROVED'),
('Payment Received', 'UTILITY', 'en', 'Hi {{1}}, we have successfully received your payment of {{2}}. Thank you!', '["Member Name", "Amount"]', 'APPROVED'),
('Membership Expiring', 'UTILITY', 'en', 'Hi {{1}}, your gym membership expires on {{2}}. Please renew soon to avoid interruption.', '["Member Name", "Date"]', 'APPROVED'),
('Birthday Wishes', 'MARKETING', 'en', 'Happy Birthday {{1}}! We wish you a fantastic day and a healthy year ahead from the GymOS team.', '["Member Name"]', 'APPROVED')
ON CONFLICT (name) DO NOTHING;

-- Seed default automation rules
INSERT INTO public.automation_rules (event_type, template_id, is_active, delay_minutes)
SELECT 'MEMBER_JOINED', id, true, 0 FROM public.whatsapp_templates WHERE name = 'Welcome Message'
ON CONFLICT (event_type) DO NOTHING;

INSERT INTO public.automation_rules (event_type, template_id, is_active, delay_minutes)
SELECT 'PAYMENT_RECEIVED', id, true, 0 FROM public.whatsapp_templates WHERE name = 'Payment Received'
ON CONFLICT (event_type) DO NOTHING;

INSERT INTO public.automation_rules (event_type, template_id, is_active, delay_minutes)
SELECT 'MEMBERSHIP_EXPIRING', id, true, 0 FROM public.whatsapp_templates WHERE name = 'Membership Expiring'
ON CONFLICT (event_type) DO NOTHING;

INSERT INTO public.automation_rules (event_type, template_id, is_active, delay_minutes)
SELECT 'BIRTHDAY', id, true, 0 FROM public.whatsapp_templates WHERE name = 'Birthday Wishes'
ON CONFLICT (event_type) DO NOTHING;
