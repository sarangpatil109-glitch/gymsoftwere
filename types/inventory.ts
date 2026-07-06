export type InventoryCategory = "Protein" | "Creatine" | "Pre Workout" | "BCAA" | "Mass Gainer" | "Accessories" | "Merchandise";
export type StockMovementType = "IN" | "OUT" | "ADJUST";
export type PaymentMethod = "CASH" | "CARD" | "UPI";

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  image_url?: string;
  name: string;
  sku: string;
  barcode?: string;
  category: InventoryCategory;
  brand?: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  minimum_stock: number;
  supplier_id?: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
  
  supplier?: Supplier; // Joined data
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: StockMovementType;
  quantity: number;
  notes?: string;
  created_by?: string;
  created_at?: string;
  
  product?: Product;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
  
  product?: Product;
}

export interface Sale {
  id: string;
  member_id?: string;
  total_amount: number;
  discount: number;
  final_amount: number;
  payment_method: PaymentMethod;
  status: "COMPLETED" | "REFUNDED";
  created_at?: string;
  
  member?: { id: string; first_name: string; last_name: string; phone: string; member_id: string };
  items?: SaleItem[];
}

export interface POSCartItem {
  product: Product;
  quantity: number;
}
