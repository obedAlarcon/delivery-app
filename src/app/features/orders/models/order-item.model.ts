export interface OrderItem {
 id?: number;           // ✅ Opcional
  orderId?: number;  
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt?: string;
  product?: {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
  };

}