import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './recovery.html',
  styleUrl: './recovery.css'
})
export class Recovery {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';

  newPassword = '';
  confirmPassword = '';

  loading = false;

  ngOnInit(): void {

    this.token =
      this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {

      Swal.fire({
        icon: 'error',
        title: 'Enlace inválido',
        text: 'El enlace de recuperación no es válido o está incompleto.',
        confirmButtonText: 'Aceptar'
      });

    }

  }

  onSubmit(): void {

    // Validar token
    if (!this.token) {

      Swal.fire({
        icon: 'error',
        title: 'Enlace inválido',
        text: 'Falta el token de recuperación.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    // Validar longitud
    if (this.newPassword.length < 6) {

      Swal.fire({
        icon: 'warning',
        title: 'Contraseña demasiado corta',
        text: 'La contraseña debe tener mínimo 6 caracteres.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    // Validar mayúscula
    if (!/[A-Z]/.test(this.newPassword)) {

      Swal.fire({
        icon: 'warning',
        title: 'Falta una mayúscula',
        text: 'La contraseña debe contener al menos una letra mayúscula.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    // Validar minúscula
    if (!/[a-z]/.test(this.newPassword)) {

      Swal.fire({
        icon: 'warning',
        title: 'Falta una minúscula',
        text: 'La contraseña debe contener al menos una letra minúscula.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    // Validar número
    if (!/[0-9]/.test(this.newPassword)) {

      Swal.fire({
        icon: 'warning',
        title: 'Falta un número',
        text: 'La contraseña debe contener al menos un número.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    // Validar carácter especial
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(this.newPassword)) {

      Swal.fire({
        icon: 'warning',
        title: 'Falta un carácter especial',
        text: 'La contraseña debe contener al menos un carácter especial.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    // Confirmar contraseña
    if (this.newPassword !== this.confirmPassword) {

      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas sean iguales.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    this.loading = true;

    this.authService.changePassword(
      this.token,
      this.newPassword
    ).subscribe({

      next: () => {

        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: '¡Contraseña actualizada!',
          text: 'Tu contraseña ha sido cambiada correctamente.',
          confirmButtonText: 'Ir al inicio de sesión',
          allowOutsideClick: false
        }).then(() => {

          this.router.navigate(['/login']);

        });

      },

      error: (error) => {

        console.error(
          'Error cambiando contraseña:',
          error
        );

        this.loading = false;

        if (error.status === 401) {

          Swal.fire({
            icon: 'error',
            title: 'Enlace vencido',
            text: 'El enlace venció o ya fue utilizado. Solicita uno nuevo.',
            confirmButtonText: 'Aceptar'
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'No fue posible cambiar la contraseña',
            text: 'Inténtalo nuevamente.',
            confirmButtonText: 'Aceptar'
          });

        }

      }

    });

  }

}