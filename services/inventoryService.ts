import { supabase } from "@/lib/supabase";
import { Product, Supplier, Sale, POSCartItem, PaymentMethod } from "@/types/inventory";
import { v4 as uuidv4 } from "uuid";

export const inventoryService = {
  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('inventory_products')
      .select(`
        *,
        supplier:inventory_suppliers(*)
      `)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getLowStockProducts(): Promise<Product[]> {
    // Cannot do `stock < minimum_stock` directly in Supabase JS easily without rpc or raw query unless we filter client side or use a view.
    // For now, we'll fetch all and filter, or use an RPC. Since we don't have RPC, we fetch and filter.
    const products = await this.getProducts();
    return products.filter(p => p.stock <= p.minimum_stock);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('inventory_products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('inventory_products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('inventory_products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Stock Adjustment (Manual)
  async adjustStock(productId: string, quantity: number, notes: string): Promise<boolean> {
    // Fetch current stock
    const { data: prod, error: fetchErr } = await supabase.from('inventory_products').select('stock').eq('id', productId).single();
    if (fetchErr) throw fetchErr;

    const newStock = prod.stock + quantity;
    
    // Update stock
    const { error: updateErr } = await supabase.from('inventory_products').update({ stock: newStock }).eq('id', productId);
    if (updateErr) throw updateErr;

    // Log movement
    const { error: logErr } = await supabase.from('inventory_stock_movements').insert({
      product_id: productId,
      type: 'ADJUST',
      quantity,
      notes
    });
    if (logErr) throw logErr;

    return true;
  },

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('inventory_suppliers')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  // POS / Sales
  async processSale(cart: POSCartItem[], memberId: string | undefined, discount: number, paymentMethod: PaymentMethod): Promise<Sale> {
    // Calculate totals
    const total_amount = cart.reduce((sum, item) => sum + (item.product.selling_price * item.quantity), 0);
    const final_amount = total_amount - discount;

    const saleId = uuidv4();

    // 1. Create Sale Record
    const { data: saleData, error: saleError } = await supabase
      .from('store_sales')
      .insert({
        id: saleId,
        member_id: memberId || null,
        total_amount,
        discount,
        final_amount,
        payment_method: paymentMethod,
        status: 'COMPLETED'
      })
      .select()
      .single();
    
    if (saleError) throw saleError;

    // 2. Create Sale Items (this will automatically trigger deduct_stock_on_sale in the DB)
    const saleItems = cart.map(item => ({
      sale_id: saleId,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.selling_price,
      subtotal: item.product.selling_price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('store_sale_items')
      .insert(saleItems);
    
    if (itemsError) throw itemsError;

    return saleData;
  },

  // Reports
  async getRecentSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('store_sales')
      .select(`
        *,
        member:members(id, first_name, last_name, phone, member_id),
        items:store_sale_items(
          *,
          product:inventory_products(*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  }
};
