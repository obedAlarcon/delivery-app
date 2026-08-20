import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css'
})
export class UserEdit implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private userId = 0;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    role: ['user', Validators.required],
    isActive: true
  });

  ngOnInit(): void {

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUser(this.userId).subscribe({

      next: (user) => {

        this.form.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive
        });

      },

      error: () => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el usuario.'
        });

        this.router.navigate(['/users']);

      }

    });

  }

  update() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Complete todos los campos.'
      });

      return;

    }

    this.userService.updateUser(
      this.userId,
      this.form.getRawValue()
    ).subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          timer: 1800,
          showConfirmButton: false
        });

        this.router.navigate(['/users']);

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No fue posible actualizar el usuario.'
        });

      }

    });

  }
  cancel() {

  if (this.form.dirty) {

    Swal.fire({
      title: '¿Cancelar?',
      text: 'Se perderán los datos ingresados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Continuar editando',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {

      if (result.isConfirmed) {

        this.form.reset({
          name: '',
          email: '',
          phone: '',
        
          role: 'user',
          isActive: true
        });

        this.router.navigate(['/users']);
      }

    });

  } else {

    this.router.navigate(['/users']);

  }

}
reset(){
  this.router.navigate(['/users']);
}
}