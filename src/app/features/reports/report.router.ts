import { Routes } from '@angular/router';

export const reportsRoutes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/report-list/report-list')
        .then(c => c.ReportList)
  }

];