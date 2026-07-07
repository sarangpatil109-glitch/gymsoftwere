-- 1. Drop existing function if it exists to ensure clean recreation
DROP FUNCTION IF EXISTS factory_reset();

-- 2. Create the updated Factory Reset RPC Function
CREATE OR REPLACE FUNCTION factory_reset()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Truncate business data tables using CASCADE
    --    This automatically handles dependent tables (e.g. diet_plan_meals, workout_exercises)
    --    Admin accounts, Authentication, Settings, Exercise Library, Diet Library, Automation Rules/Templates remain intact.
    
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
        automation_jobs,
        automation_logs, 
        inventory_suppliers, 
        inventory_products, 
        inventory_stock_movements, 
        store_sales,
        trainers,
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

-- 3. Reload PostgREST schema cache so the API can see the new/updated function
NOTIFY pgrst, 'reload schema';
