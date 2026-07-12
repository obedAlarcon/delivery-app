import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menu = [

    {
      icon: 'bi-speedometer2',
      label: 'Dashboard',
      route: '/dashboard'
    },

    {
      icon: 'bi-box-seam',
      label: 'Productos',
      route: '/products'
    },

    {
      icon: 'bi-tags',
      label: 'Categorías',
      route: '/categories'
    },

    {
      icon: 'bi-cart3',
      label: 'Pedidos',
      route: '/orders'
    },

    {
      icon: 'bi-people',
      label: 'Usuarios',
      route: '/users'
    },

    {
      icon: 'bi-person-badge',
      label: 'Clientes',
      route: '/customers'
    },

    {
      icon: 'bi-graph-up',
      label: 'Reportes',
      route: '/reports'
    },

    {
      icon: 'bi-gear',
      label: 'Configuración',
      route: '/settings'
    }

  ];
private authService = inject(AuthService);

logout() {
  this.authService.logout();
}
}
