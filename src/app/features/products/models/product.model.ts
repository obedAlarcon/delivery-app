import { Category } from '../../categories/models/category.model';

export interface Product {

  id: number;

  name: string;

  description: string;

  // Precio de compra
  purchasePrice: number;

  // Precio de venta
  price: number;

  stock: number;

  // Stock mínimo
  minStock: number;

  imageUrl: string;

  categoryId: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  category?: Category;

}

export interface CreateProductDto {

  name: string;

  description: string;

  purchasePrice: number;

  price: number;

  stock: number;

  minStock: number;

  imageUrl?: string;

  categoryId: number;

  isActive?: boolean;

}

export interface UpdateProductDto
  extends Partial<CreateProductDto> {

}