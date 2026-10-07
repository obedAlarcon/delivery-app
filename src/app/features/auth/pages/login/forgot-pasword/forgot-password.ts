import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  email = '';

  submitted = false;

  loading = false;

  errorMessage = '';

  onSubmit(): void {

  if (!this.email.trim()) {
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.cdr.detectChanges();

  this.authService.recovery(this.email.trim()).subscribe({

    next: (response) => {

      console.log('Respuesta:', response);

      this.loading = false;
      this.submitted = true;

      this.cdr.detectChanges();

    },

    error: (error) => {

      console.error('Error:', error);

      this.loading = false;
      this.errorMessage =
        'No fue posible enviar el correo de recuperación.';

      this.cdr.detectChanges();

    }

  });

  // PRUEBA TEMPORAL
  setTimeout(() => {

    if (this.loading) {

      console.log(
        'La petición sigue pendiente. Liberando loading.'
      );

      this.loading = false;
      this.submitted = true;

      this.cdr.detectChanges();

    }

  }, 5000);

}

}