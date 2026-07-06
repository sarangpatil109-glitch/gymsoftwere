-- 09_init_inventory.sql

CREATE TABLE IF NOT EXISTS public.inventory_suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.inventory_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT UNIQUE,
  category TEXT NOT NULL,
  brand TEXT,
  purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  selling_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 5,
  supplier_id UUID REFERENCES public.inventory_suppliers(id) ON DELETE SET NULL,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.inventory_stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.inventory_products(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'IN' (Purchase/Restock), 'OUT' (Sale/Spoilage), 'ADJUST' (Correction)
  quantity INTEGER NOT NULL, -- positive for IN/ADJUST_UP, negative for OUT/ADJUST_DOWN
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.store_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL, -- Can be null for walk-ins
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  final_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_method TEXT NOT NULL, -- 'CASH', 'CARD', 'UPI'
  status TEXT NOT NULL DEFAULT 'COMPLETED', -- 'COMPLETED', 'REFUNDED'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.store_sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.store_sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.inventory_products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE TRIGGER update_inventory_suppliers_modtime
BEFORE UPDATE ON public.inventory_suppliers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_inventory_products_modtime
BEFORE UPDATE ON public.inventory_products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Function and Trigger to automatically deduct stock on sale
CREATE OR REPLACE FUNCTION deduct_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Deduct stock from the product
    UPDATE public.inventory_products
    SET stock = stock - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id;

    -- Automatically log the stock movement
    INSERT INTO public.inventory_stock_movements (product_id, type, quantity, notes)
    VALUES (NEW.product_id, 'OUT', -NEW.quantity, 'Sale (Auto-deducted)');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deduct_stock_on_sale
AFTER INSERT ON public.store_sale_items
FOR EACH ROW
EXECUTE FUNCTION deduct_stock_on_sale();

-- Function and Trigger to automatically restore stock on refund/delete
CREATE OR REPLACE FUNCTION restore_stock_on_refund()
RETURNS TRIGGER AS $$
BEGIN
    -- Restore stock
    UPDATE public.inventory_products
    SET stock = stock + OLD.quantity,
        updated_at = now()
    WHERE id = OLD.product_id;

    -- Automatically log the stock movement
    INSERT INTO public.inventory_stock_movements (product_id, type, quantity, notes)
    VALUES (OLD.product_id, 'IN', OLD.quantity, 'Refund/Return (Auto-restored)');

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_restore_stock_on_refund
AFTER DELETE ON public.store_sale_items
FOR EACH ROW
EXECUTE FUNCTION restore_stock_on_refund();

-- Insert dummy data for Inventory & Store
INSERT INTO public.inventory_suppliers (name, contact_person, phone) VALUES 
('Optimum Nutrition Direct', 'John Doe', '+1234567890'),
('MusclePharm Dist', 'Jane Smith', '+0987654321')
ON CONFLICT DO NOTHING;

INSERT INTO public.inventory_products (name, sku, barcode, category, brand, purchase_price, selling_price, stock, minimum_stock, expiry_date) VALUES 
('Gold Standard 100% Whey 2Lbs', 'ON-WHEY-2LB', '846923485234', 'Protein', 'Optimum Nutrition', 30.00, 45.00, 15, 5, '2027-12-31'),
('C4 Original Pre-Workout', 'C4-PRE-30S', '93452349058', 'Pre Workout', 'Cellucor', 15.00, 25.00, 3, 5, '2026-08-15'),
('Micronized Creatine Powder 600g', 'ON-CREA-600', '846923411111', 'Creatine', 'Optimum Nutrition', 12.00, 20.00, 20, 10, '2028-01-01'),
('GymOS Premium Shaker', 'GYMOS-SHAKER-1', '0000000001', 'Accessories', 'GymOS', 2.00, 8.00, 50, 10, NULL)
ON CONFLICT (sku) DO NOTHING;
