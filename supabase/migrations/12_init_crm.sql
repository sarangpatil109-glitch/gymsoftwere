-- Create Lead Stage Enum
CREATE TYPE lead_stage AS ENUM (
    'New',
    'Contacted',
    'Interested',
    'Trial Scheduled',
    'Trial Completed',
    'Negotiation',
    'Joined',
    'Lost'
);

-- Create Lead Followup Status Enum
CREATE TYPE lead_followup_status AS ENUM (
    'Interested',
    'Call Back',
    'Busy',
    'No Answer',
    'Not Interested',
    'Joined'
);

-- Create Lead Trial Status Enum
CREATE TYPE lead_trial_status AS ENUM (
    'Scheduled',
    'Attended',
    'Missed',
    'Rescheduled',
    'Completed'
);

-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_url TEXT,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    gender TEXT,
    age INTEGER,
    address TEXT,
    occupation TEXT,
    fitness_goal TEXT,
    lead_source TEXT,
    budget NUMERIC,
    preferred_batch TEXT,
    trainer_preference TEXT,
    medical_conditions TEXT,
    notes TEXT,
    stage lead_stage NOT NULL DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Followups Table
CREATE TABLE lead_followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    followup_date DATE NOT NULL,
    time TIME,
    status lead_followup_status NOT NULL,
    notes TEXT,
    next_followup_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Trials Table
CREATE TABLE lead_trials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    trial_date DATE NOT NULL,
    time TIME,
    trainer_id TEXT, -- text or UUID based on settings_trainers or similar table
    workout_type TEXT,
    status lead_trial_status NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Notes Table
CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable all for authenticated users on leads" ON leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users on lead_followups" ON lead_followups FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users on lead_trials" ON lead_trials FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users on lead_notes" ON lead_notes FOR ALL TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_trials_updated_at BEFORE UPDATE ON lead_trials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update Automations
ALTER TYPE automation_trigger_type ADD VALUE 'NEW_LEAD';
ALTER TYPE automation_trigger_type ADD VALUE 'TRIAL_TOMORROW';
ALTER TYPE automation_trigger_type ADD VALUE 'TRIAL_MISSED';
ALTER TYPE automation_trigger_type ADD VALUE 'LEAD_CONVERTED';

-- Insert CRM Automation Templates
INSERT INTO automation_templates (id, name, type, subject, content) VALUES
('88888888-8888-8888-8888-888888888888', 'Lead Welcome Message', 'Welcome', 'Welcome to {{gym_name}}!', 'Hi {{lead_name}},\n\nThanks for your interest in {{gym_name}}! We are excited to help you reach your fitness goals. Let us know when you would like to visit us.\n\nBest,\n{{gym_name}} Team'),
('99999999-9999-9999-9999-999999999999', 'Trial Reminder', 'Reminder', 'Your Trial is Tomorrow', 'Hi {{lead_name}},\n\nThis is a friendly reminder that your trial session at {{gym_name}} is scheduled for tomorrow at {{trial_time}}.\n\nSee you there!\n\nBest,\n{{gym_name}} Team'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Trial Missed', 'Follow-up', 'We missed you!', 'Hi {{lead_name}},\n\nWe missed you at your scheduled trial today at {{gym_name}}. Please let us know if you would like to reschedule.\n\nBest,\n{{gym_name}} Team'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Lead Converted Welcome', 'Welcome', 'Welcome as a Member!', 'Hi {{lead_name}},\n\nCongratulations on joining {{gym_name}}! We are thrilled to have you as an official member.\n\nBest,\n{{gym_name}} Team');

-- Insert CRM Default Rules
INSERT INTO automation_rules (name, trigger_type, template_id, condition_details) VALUES
('Send Lead Welcome', 'NEW_LEAD', '88888888-8888-8888-8888-888888888888', '{}'::jsonb),
('Send Trial Reminder', 'TRIAL_TOMORROW', '99999999-9999-9999-9999-999999999999', '{}'::jsonb),
('Send Missed Trial Follow-up', 'TRIAL_MISSED', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{}'::jsonb),
('Send Member Conversion Welcome', 'LEAD_CONVERTED', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '{}'::jsonb);
