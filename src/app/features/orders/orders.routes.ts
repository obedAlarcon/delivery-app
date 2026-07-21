import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/order-list/order-list')
        .then(c => c.OrderList)
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./pages/order-create/order-create')
        .then(c => c.OrderCreate)
  },

  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/order-edit/order-edit')
        .then(c => c.OrderEdit)
  },

  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/order-detail/order-detail')
        .then(c => c.OrderDetail)
  }

];