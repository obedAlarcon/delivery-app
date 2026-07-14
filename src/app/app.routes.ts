import { Routes } from '@angular/router';
import { DashboardLayout } from './shared/layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth-guard';




// 1. Fíjate que dice CheckoutComponent (con Component al final)

// 2. Fíjate que dice HomeComponent (con Component al final)


export const routes: Routes = [
 
    {
  path: 'login',
  loadChildren: () =>
    import('./features/auth/auth.routes').then(m => m.authRoutes)
},
     {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard], // 👈 Protege todas las rutas hijas
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.router').then(m => m.productsRoutes)
      },
      {
  path: 'categories',
  loadChildren: () =>
    import('./features/categories/categories.routes')
      .then(m => m.categoriesRoutes)
},
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
  


              
];