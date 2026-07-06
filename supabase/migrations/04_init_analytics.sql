-- Migration: 04_init_analytics
-- Description: Creates optimized views for business intelligence and reporting.

-- 1. Monthly Revenue View
CREATE OR REPLACE VIEW vw_monthly_revenue AS
SELECT 
  DATE_TRUNC('month', payment_date) AS month,
  SUM(amount_paid) AS total_revenue
FROM payments
WHERE payment_status = 'Success' OR payment_status = 'Completed' OR payment_status IS NULL -- Assuming standard payment table
GROUP BY DATE_TRUNC('month', payment_date)
ORDER BY month DESC;

-- 2. Daily Attendance View
CREATE OR REPLACE VIEW vw_daily_attendance AS
SELECT 
  attendance_date AS date,
  COUNT(*) AS total_attendances
FROM attendance
WHERE status = 'Present'
GROUP BY attendance_date
ORDER BY attendance_date DESC;

-- 3. Member Growth View
CREATE OR REPLACE VIEW vw_member_growth AS
SELECT 
  DATE_TRUNC('month', joining_date::date) AS month,
  COUNT(*) AS new_members
FROM members
GROUP BY DATE_TRUNC('month', joining_date::date)
ORDER BY month DESC;

-- 4. Membership Distribution View
CREATE OR REPLACE VIEW vw_membership_distribution AS
SELECT 
  membership_type,
  COUNT(*) AS total_count
FROM memberships
WHERE status = 'Active'
GROUP BY membership_type
ORDER BY total_count DESC;

-- 5. Payment Methods View
CREATE OR REPLACE VIEW vw_payment_methods AS
SELECT 
  payment_method,
  COUNT(*) AS transaction_count,
  SUM(amount_paid) AS total_amount
FROM payments
GROUP BY payment_method
ORDER BY total_amount DESC;

-- 6. Expiring Memberships (Next 30 Days)
CREATE OR REPLACE VIEW vw_expiring_memberships AS
SELECT 
  m.id AS membership_id,
  m.member_id,
  m.membership_type,
  m.expiry_date,
  m.status,
  mem.full_name,
  mem.mobile_number
FROM memberships m
JOIN members mem ON m.member_id = mem.id
WHERE m.status = 'Active' 
  AND m.expiry_date::date >= CURRENT_DATE 
  AND m.expiry_date::date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY m.expiry_date ASC;

-- 7. Pending Payments View
CREATE OR REPLACE VIEW vw_pending_payments AS
SELECT 
  m.id AS membership_id,
  m.member_id,
  m.membership_type,
  m.final_amount,
  COALESCE((SELECT SUM(amount_paid) FROM payments p WHERE p.membership_id = m.id), 0) AS total_paid,
  m.final_amount - COALESCE((SELECT SUM(amount_paid) FROM payments p WHERE p.membership_id = m.id), 0) AS pending_amount,
  mem.full_name,
  mem.mobile_number
FROM memberships m
JOIN members mem ON m.member_id = mem.id
WHERE m.payment_status = 'Pending' OR m.payment_status = 'Partial'
ORDER BY pending_amount DESC;
