import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../features/auth/services/auth.service';
import { SidebarService } from '../../../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

private sidebarService = inject(SidebarService);

isOpen = this.sidebarService.isOpen;
  
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
  label: 'Proveedores',
  icon: 'bi-truck',
  route: '/suppliers'
},
{
 icon:'bi-bag-check',
 label:'Compras',
 route:'/purchases'
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
    },

  ];
private authService = inject(AuthService);

logout() {
  this.authService.logout();
}

closeSidebar(): void {

  if (window.innerWidth < 992) {

    this.sidebarService.close();

  }

}
}
