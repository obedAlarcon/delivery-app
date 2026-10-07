import { Routes } from '@angular/router';

export const creditsRoutes: Routes = [

  {
    path: ':id',
    loadComponent: () =>
      import('./credit-detail/credit-detail')
        .then(m => m.CreditDetail)
  },

  {
    path: '',
    loadComponent: () =>
      import('./credits/credits')
        .then(m => m.Credits)
  }

];