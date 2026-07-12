import { Routes } from '@angular/router';
import { ProductList } from './pages/product-list/product-list';
import { ProductCreate } from './pages/product-create/product-create';
import { ProductEdit } from './pages/product-edit/product-edit';

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductList
  },
   {
    path: 'create',
    component: ProductCreate
  },
  {
    path: 'edit/:id',
    component: ProductEdit
  }
];