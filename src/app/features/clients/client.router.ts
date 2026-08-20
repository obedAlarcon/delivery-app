import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [

  {
    path: '',

    loadComponent: () =>
      import('./pages/client-layout/client-layout')
        .then(m => m.ClientLayout),

    children: [

      // ==========================================
      // INICIO
      // ==========================================

      {
        path: '',

        redirectTo: 'catalog',

        pathMatch: 'full'
      },


      // ==========================================
      // CATÁLOGO
      // ==========================================

      {
        path: 'catalog',

        loadComponent: () =>
          import('./pages/catalog/catalog')
            .then(m => m.Catalog)
      },


      // ==========================================
      // CARRITO
      // ==========================================

      {
        path: 'cart',

        loadComponent: () =>
          import('./pages/cart/cart')
            .then(m => m.Cart)
      },


      // ==========================================
      // CHECKOUT
      // ==========================================

      {
        path: 'checkout',

        loadComponent: () =>
          import('./pages/checkout/checkout')
            .then(m => m.Checkout)
      },


      // ==========================================
      // CONFIRMACIÓN
      // ==========================================

      {
        path: 'order-confirmation/:id',

        loadComponent: () =>
          import('./pages/order-confirmation/order-confirmation')
            .then(m => m.OrderConfirmation)
      },


      // ==========================================
      // SEGUIMIENTO
      // ==========================================

      {
        path: 'order-tracking/:id',

        loadComponent: () =>
          import('./pages/order-tracking/order-tracking')
            .then(m => m.OrderTracking)
      },


      // ==========================================
      // HISTORIAL
      // ==========================================

      {
        path: 'order-history',

        loadComponent: () =>
          import('./pages/order-history/order-history')
            .then(m => m.OrderHistory)
      }

    ]

  }

];