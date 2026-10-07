import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ForgotPassword } from './pages/login/forgot-pasword/forgot-password';


export const authRoutes: Routes = [
  {
    path: '',
    component: Login
  },
   {
    path: 'recuperar-contrasena',
    component: ForgotPassword
  }
];