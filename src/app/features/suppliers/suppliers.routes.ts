import { Routes } from '@angular/router';

import { SupplierList } from './pages/supplier-list/supplier-list';
import { SupplierCreate } from './pages/supplier-create/supplier-create';
import { SupplierEdit } from './pages/supplier-edit/supplier-edit';

export const SUPPLIER_ROUTES: Routes = [
  {
    path: '',
    component: SupplierList
  },
  {
    path: 'create',
    component: SupplierCreate
  },
  {
    path: 'edit/:id',
    component: SupplierEdit
  }
];