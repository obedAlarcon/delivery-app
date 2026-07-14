import { Routes } from '@angular/router';

import { CategoryList } from './pages/category-list/category-list';
import { CategoryCreate } from './pages/category-create/category-create';
import { CategoryEdit } from './pages/category-edit/category-edit';

export const categoriesRoutes: Routes = [

  // ===========================================
  // Listado
  // ===========================================

  {
    path: '',
    component: CategoryList
  },

  // ===========================================
  // Crear
  // ===========================================

  {
    path: 'create',
    component: CategoryCreate
  },

  // ===========================================
  // Editar
  // ===========================================

  {
    path: 'edit/:id',
    component: CategoryEdit
  }

];