import { OrderItem } from "./order-item.model";

export interface Order {

  id: number;
  customerId: number;
  userId: number;

  deliveryAddress: string;
  deliveryReference?: string;

  total: number;

  status: string;
  paymentMethod: string;
  paymentStatus: string;

  createdAt: string;

  customer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    reference?: string;
  };

  user?: {
    id: number;
    name: string;
    email: string;
  };

  orderDetails?: OrderItem[];

}