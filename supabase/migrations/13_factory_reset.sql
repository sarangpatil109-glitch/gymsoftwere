-- Audit Logs Table for Tracking Destructive/Sensitive Actions
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    admin_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users on audit_logs" ON audit_logs FOR ALL TO authenticated USING (true);

-- Factory Reset RPC Function
CREATE OR REPLACE FUNCTION factory_reset()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Truncate business data tables using CASCADE
    --    This automatically handles dependent tables (e.g. diet_plan_meals if diet_plans is truncated)
    --    Settings, Trainers, Membership Plans, Exercise Library, Diet Library, Auth Users remain intact.
    
    TRUNCATE TABLE 
        members, 
        attendance, 
        memberships, 
        payments, 
        leads, 
        lead_followups, 
        lead_trials, 
        lead_notes, 
        workout_plans, 
        diet_plans, 
        body_measurements, 
        progress_photos, 
        whatsapp_logs, 
        automation_logs, 
        inventory_suppliers, 
        inventory_products, 
        inventory_stock_movements, 
        store_sales,
        trainer_assignments
    RESTART IDENTITY CASCADE;

    -- 2. Log the Action
    INSERT INTO audit_logs (action, admin_id)
    VALUES ('Factory Reset', auth.uid());

    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    -- If any error occurs, the transaction will automatically rollback.
    RAISE;
END;
$$;
