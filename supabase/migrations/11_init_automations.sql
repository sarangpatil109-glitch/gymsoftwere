-- Create Automation Enums
CREATE TYPE automation_trigger_type AS ENUM (
    'MEMBER_CREATED',
    'PAYMENT_RECEIVED',
    'BIRTHDAY_TODAY',
    'MEMBERSHIP_EXPIRING',
    'ATTENDANCE_MISSING',
    'WORKOUT_ASSIGNED',
    'DIET_ASSIGNED'
);

CREATE TYPE automation_action_type AS ENUM (
    'SEND_TEMPLATE'
);

CREATE TYPE automation_job_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);

CREATE TYPE automation_job_type AS ENUM (
    'WHATSAPP',
    'EMAIL',
    'SMS',
    'PUSH'
);

CREATE TYPE automation_log_status AS ENUM (
    'SUCCESS',
    'FAILED',
    'SKIPPED'
);

-- Automation Templates Table
CREATE TABLE automation_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Rules Table
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    trigger_type automation_trigger_type NOT NULL,
    condition_details JSONB DEFAULT '{}'::jsonb,
    action_type automation_action_type NOT NULL DEFAULT 'SEND_TEMPLATE',
    template_id UUID REFERENCES automation_templates(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    execution_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Jobs (Scheduled/Queue)
CREATE TABLE automation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    job_type automation_job_type NOT NULL,
    payload JSONB NOT NULL,
    status automation_job_status DEFAULT 'PENDING',
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Logs
CREATE TABLE automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    trigger_type automation_trigger_type NOT NULL,
    status automation_log_status NOT NULL,
    message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE automation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (For admin access)
CREATE POLICY "Enable all for authenticated users on automation_templates" ON automation_templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users on automation_rules" ON automation_rules FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users on automation_jobs" ON automation_jobs FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users on automation_logs" ON automation_logs FOR ALL TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_automation_templates_updated_at BEFORE UPDATE ON automation_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_jobs_updated_at BEFORE UPDATE ON automation_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Default Templates
INSERT INTO automation_templates (id, name, type, subject, content) VALUES
('11111111-1111-1111-1111-111111111111', 'Welcome Message', 'Welcome', 'Welcome to {{gym_name}}!', 'Hi {{member_name}},\n\nWelcome to {{gym_name}}! We are thrilled to have you with us. Your membership plan is {{membership_plan}}.\n\nYou can access your member portal here: {{portal_link}}\n\nBest,\n{{gym_name}} Team'),
('22222222-2222-2222-2222-222222222222', 'Payment Receipt', 'Receipt', 'Payment Received', 'Hi {{member_name}},\n\nWe have received your payment. Thank you!\n\nView receipt: {{receipt_link}}\n\nBest,\n{{gym_name}} Team'),
('33333333-3333-3333-3333-333333333333', 'Birthday Wish', 'Birthday', 'Happy Birthday!', 'Happy Birthday {{member_name}}! 🎉\n\nWishing you a fantastic day and a healthy year ahead!\n\nBest,\n{{gym_name}} Team'),
('44444444-4444-4444-4444-444444444444', 'Renewal Reminder', 'Renewal', 'Membership Expiring Soon', 'Hi {{member_name}},\n\nJust a reminder that your membership ({{membership_plan}}) expires on {{expiry_date}}.\n\nPlease renew it to continue your fitness journey!\n\nBest,\n{{gym_name}} Team'),
('55555555-5555-5555-5555-555555555555', 'Attendance Reminder', 'Attendance Reminder', 'We miss you!', 'Hi {{member_name}},\n\nWe noticed you haven''t visited the gym in a few days. Consistency is key! Hope to see you soon.\n\nBest,\n{{gym_name}} Team'),
('66666666-6666-6666-6666-666666666666', 'Workout Assigned', 'Workout Assigned', 'New Workout Plan', 'Hi {{member_name}},\n\nA new workout plan has been assigned to you by {{trainer_name}}.\n\nCheck it out in your portal: {{portal_link}}\n\nBest,\n{{gym_name}} Team'),
('77777777-7777-7777-7777-777777777777', 'Diet Assigned', 'Diet Assigned', 'New Diet Plan', 'Hi {{member_name}},\n\nA new diet plan has been assigned to you by {{trainer_name}}.\n\nCheck it out in your portal: {{portal_link}}\n\nBest,\n{{gym_name}} Team');

-- Insert Default Rules
INSERT INTO automation_rules (name, trigger_type, template_id, condition_details) VALUES
('Send Welcome Message', 'MEMBER_CREATED', '11111111-1111-1111-1111-111111111111', '{}'::jsonb),
('Send Receipt', 'PAYMENT_RECEIVED', '22222222-2222-2222-2222-222222222222', '{}'::jsonb),
('Send Birthday Wish', 'BIRTHDAY_TODAY', '33333333-3333-3333-3333-333333333333', '{}'::jsonb),
('Send Renewal Reminder', 'MEMBERSHIP_EXPIRING', '44444444-4444-4444-4444-444444444444', '{"days_remaining": 7}'::jsonb),
('Send Come Back Message', 'ATTENDANCE_MISSING', '55555555-5555-5555-5555-555555555555', '{"days_missing": 5}'::jsonb),
('Notify Member of Workout', 'WORKOUT_ASSIGNED', '66666666-6666-6666-6666-666666666666', '{}'::jsonb),
('Notify Member of Diet', 'DIET_ASSIGNED', '77777777-7777-7777-7777-777777777777', '{}'::jsonb);
