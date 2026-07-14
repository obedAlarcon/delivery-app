import { Category } from '../../categories/models/category.model';

export interface Product {

  id: number;

  name: string;

  description: string;

  price: number;

  stock: number;

  imageUrl: string;

  categoryId: number;

  isActive: boolean;

  createdAt: string;

  category?: Category;

}