import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-create',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

 form = this.fb.nonNullable.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(6)]],
  role: ['user', Validators.required],
  isActive: true
});

 save() {
  if (this.form.invalid) {

    this.form.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor complete todos los campos obligatorios.',
      confirmButtonColor: '#0d6efd'
    });

    return;
  }

  const user = this.form.getRawValue();

  this.userService.createUser(user).subscribe({
    next: () => {

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Usuario creado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });

      this.router.navigate(['/users']);
    },

    error: (err) => {

      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error?.message || 'No fue posible crear el usuario.',
        confirmButtonColor: '#dc3545'
      });

    }
  });
}
}
