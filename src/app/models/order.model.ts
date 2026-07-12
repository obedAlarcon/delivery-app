// Interfaces de Pedido
export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  deliveryAddress: string;
  deliveryReference: string;
  total: number;
  status: string;
  paymentMethod: string;
  items?: OrderItem[]; 
}
export interface OrderInput {
  userId: number;
  deliveryAddress: string;
  deliveryReference: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[]; 
}