import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list')
        .then(c => c.ProductList)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/product-create/product-create')
        .then(c => c.ProductCreate)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/product-edit/product-edit')
        .then(c => c.ProductEdit)
  }
];