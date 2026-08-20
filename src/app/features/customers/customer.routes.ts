     import { Routes } from '@angular/router';

import { CustomerList } from './pages/customer-list/customer-list';
import { CustomerCreate } from './pages/customer-create/customer-create';
import { CustomerEdit } from './pages/customer-edit/customer-edit';

export const CUSTOMER_ROUTES: Routes = [

  {
    path: '',
    component: CustomerList
  },

  {
    path: 'create',
    component: CustomerCreate
  },

  {
    path: 'edit/:id',
    component: CustomerEdit
  }

];