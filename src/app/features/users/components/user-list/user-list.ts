import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserFilters } from '../user-filters/user-filters';
import { UserTable } from '../user-table/user-table';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserTable,
    UserFilters
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  filteredUsers: User[] = [];

  search = '';
  role = '';
  status = '';

  loading = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;

    this.userService.getUsers().subscribe({

      next: (data) => {

        this.users = data;
        this.filteredUsers = [...data];

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);
        this.loading = false;

      }

    });

  }

  createUser(): void {
    this.router.navigate(['/dashboard/users/create']);
  }

  editUser(id: number): void {
    this.router.navigate(['/dashboard/users/edit', id]);
  }

  deleteUser(id: number): void {

    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        this.userService.deleteUser(id).subscribe({

          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El usuario fue eliminado correctamente.',
              timer: 1800,
              showConfirmButton: false
            });

            this.loadUsers();

          },

          error: (err) => {

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'No se pudo eliminar el usuario.'
            });

          }

        });

      }

    });

  }

  onSearch(search: string): void {

    this.search = search.toLowerCase();
    this.applyFilters();

  }

  onRole(role: string): void {

    this.role = role;
    this.applyFilters();

  }

  onStatus(status: string): void {

    this.status = status;
    this.applyFilters();

  }

  clearFilters(): void {

    this.search = '';
    this.role = '';
    this.status = '';

    this.filteredUsers = [...this.users];

  }

  private applyFilters(): void {

    this.filteredUsers = this.users.filter(user => {

      const matchesSearch =

        user.name.toLowerCase().includes(this.search) ||
        user.email.toLowerCase().includes(this.search);

      const matchesRole =

        !this.role ||
        user.role === this.role;

      const matchesStatus =

        this.status === ''
          ? true
          : user.isActive === (this.status === 'true');

      return matchesSearch &&
             matchesRole &&
             matchesStatus;

    });

  }

}