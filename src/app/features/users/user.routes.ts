import { Routes } from '@angular/router';

import { UserListComponent } from './components/user-list/user-list';
import { UserCreate } from './components/user-create/user-create';
import { UserEdit } from './components/user-edit/user-edit';


export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/user-create/user-create')
        .then(m => m.UserCreate)
  },
  {
    path: 'edit/:id',
    component: UserEdit
  }
];