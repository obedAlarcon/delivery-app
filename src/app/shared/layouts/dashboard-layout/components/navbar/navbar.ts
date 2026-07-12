import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private authService = inject(AuthService);

  user = this.authService.getCurrentUser();
  constructor() {
    console.log('Usuario:', this.user);
  }

  logout() {
    this.authService.logout();
  }
}
