import {
  Component,
  HostListener,
  inject,
 
} from '@angular/core';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../../../../features/auth/services/auth.service';
import { SidebarService } from '../../../../../core/services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  //==========================================
  // Evento para abrir/cerrar Sidebar
  //==========================================

  
  //==========================================
  // Dependencias
  //==========================================

  private authService = inject(AuthService);

  private router = inject(Router);
private sidebarService = inject(SidebarService);
  //==========================================
  // Usuario
  //==========================================

  user = this.authService.getCurrentUser();

  //==========================================
  // Dropdown
  //==========================================

  isMenuOpen = false;

  toggleMenu(): void {

    this.isMenuOpen = !this.isMenuOpen;

  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {

    const target = event.target as HTMLElement;

    if (!target.closest('.user-dropdown')) {

      this.isMenuOpen = false;

    }

  }

  //==========================================
  // Perfil
  //==========================================

  goToProfile(): void {

    this.isMenuOpen = false;

    this.router.navigate(['/profile']);

  }

  //==========================================
  // Cerrar sesión
  //==========================================

  logout(): void {

    this.isMenuOpen = false;

    Swal.fire({

      title: 'Cerrar sesión',

      text: '¿Deseas salir del sistema?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Sí, salir',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#0d6efd',

      cancelButtonColor: '#6c757d',

      reverseButtons: true

    }).then(result => {

      if (result.isConfirmed) {

        this.authService.logout();

      }

    });

  }
openSidebar(): void {

  this.sidebarService.toggle();

}
}