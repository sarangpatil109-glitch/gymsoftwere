-- Create memberships table
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    membership_type TEXT NOT NULL, -- Monthly, Quarterly, Half Yearly, Yearly
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active', -- Active, Expired, Cancelled, Renewed
    payment_status TEXT NOT NULL DEFAULT 'Pending', -- Paid, Partial, Pending
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for memberships
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for memberships" ON public.memberships FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger for memberships
CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number TEXT UNIQUE NOT NULL, -- Auto-generated PAY000001
    membership_id UUID NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL, -- Cash, UPI, Card, Bank Transfer, Other
    transaction_reference TEXT,
    discount NUMERIC(10, 2) DEFAULT 0,
    balance_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Paid', -- Paid, Partial, Pending
    remarks TEXT,
    receipt_number TEXT UNIQUE NOT NULL, -- Mirrors payment_number
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sequence for payment_number
CREATE SEQUENCE IF NOT EXISTS payment_number_seq START 1;

-- Function to auto-generate PAY000001
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_number IS NULL THEN
        NEW.payment_number := 'PAY' || LPAD(nextval('payment_number_seq')::TEXT, 6, '0');
        NEW.receipt_number := NEW.payment_number;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to attach payment number on insert
CREATE TRIGGER set_payment_number
    BEFORE INSERT ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION generate_payment_number();

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger for payments
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_memberships_member_id ON public.memberships (member_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships (status);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON public.payments (member_id);
CREATE INDEX IF NOT EXISTS idx_payments_membership_id ON public.payments (membership_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON public.payments (payment_date);
