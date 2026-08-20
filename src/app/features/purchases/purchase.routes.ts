import { Routes } from '@angular/router';

 
import { PurchaseCreate } from './pages/purchase-create/purchase-create';
import { PurchaseEdit } from './pages/purchase-edit/purchase-edit';

import { PurchaseList } from './pages/purchase-list/purchase-list';
import { PurchaseDetail } from './components/purchase-detail/purchase-detail';
import { PurchaseView } from './pages/purchase-view/purchase-view';


export const PURCHASE_ROUTES: Routes = [

  {
    path:'',
    component:PurchaseList
  },

  {
    path:'create',
    component:PurchaseCreate
  },

  {
    path:'edit/:id',
    component:PurchaseEdit
  },

  
   {
  path: 'detail/:id',
  component: PurchaseView
}

];