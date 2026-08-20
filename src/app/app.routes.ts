import { Routes } from '@angular/router';
import { DashboardLayout } from './shared/layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [



  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.authRoutes)
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./features/clients/client.router')
        .then(m => m.CLIENT_ROUTES)
  },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(m => m.dashboardRoutes)
      },

      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.router')
            .then(m => m.productsRoutes)
      },

      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes')
            .then(m => m.categoriesRoutes)
      },

      {
        path: 'orders',
        loadChildren: () =>
          import('./features/orders/orders.routes')
            .then(m => m.ordersRoutes)
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/user.routes')
            .then(m => m.USER_ROUTES)
      },

      {
        path: 'customers',
        loadChildren: () =>
          import('./features/customers/customer.routes')
            .then(m => m.CUSTOMER_ROUTES)
      },

      {
        path: 'suppliers',
        loadChildren: () =>
          import('./features/suppliers/suppliers.routes')
            .then(m => m.SUPPLIER_ROUTES)
      },

      {
        path: 'purchases',
        loadChildren: () =>
          import('./features/purchases/purchase.routes')
            .then(m => m.PURCHASE_ROUTES)
      },

      // REPORTES
      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/report.router')
            .then(m => m.reportsRoutes)
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]

  }

];