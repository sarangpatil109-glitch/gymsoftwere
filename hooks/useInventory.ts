import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventoryService";
import { Product, POSCartItem, PaymentMethod } from "@/types/inventory";
import { toast } from "sonner";

export function useInventoryProducts() {
  return useQuery({
    queryKey: ['inventoryProducts'],
    queryFn: () => inventoryService.getProducts(),
  });
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ['inventoryLowStock'],
    queryFn: () => inventoryService.getLowStockProducts(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Partial<Product>) => inventoryService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLowStock'] });
      toast.success("Product created successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to create product"),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string, product: Partial<Product> }) => inventoryService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLowStock'] });
      toast.success("Product updated successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to update product"),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLowStock'] });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete product"),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity, notes }: { productId: string, quantity: number, notes: string }) => 
      inventoryService.adjustStock(productId, quantity, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLowStock'] });
      toast.success("Stock adjusted successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to adjust stock"),
  });
}

export function useProcessSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cart, memberId, discount, paymentMethod }: { cart: POSCartItem[], memberId?: string, discount: number, paymentMethod: PaymentMethod }) => 
      inventoryService.processSale(cart, memberId, discount, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLowStock'] });
      queryClient.invalidateQueries({ queryKey: ['storeSales'] });
      toast.success("Sale completed successfully");
    },
    onError: (error: any) => toast.error(error.message || "Failed to process sale"),
  });
}

export function useRecentSales() {
  return useQuery({
    queryKey: ['storeSales'],
    queryFn: () => inventoryService.getRecentSales(),
  });
}

export function useSuppliers() {
  return useQuery({
    queryKey: ['inventorySuppliers'],
    queryFn: () => inventoryService.getSuppliers(),
  });
}
