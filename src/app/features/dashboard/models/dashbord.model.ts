export interface DashboardStats {
  products: number;
  categories: number;
  orders: number;
  customers: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
}

export interface RecentOrder {
  id: number;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
}