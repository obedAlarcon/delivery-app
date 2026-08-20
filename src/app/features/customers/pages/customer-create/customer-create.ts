import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerService } from '../../services/customer.service';
import { CreateCustomerDto } from '../../models/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    CustomerForm,CommonModule
  ],
  templateUrl: './customer-create.html',
  styleUrl: './customer-create.css'
})
export class CustomerCreate {

  private customerService = inject(CustomerService);
  private router = inject(Router);

  save(customer: CreateCustomerDto): void {

    this.customerService.create(customer).subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Cliente registrado',
          text: 'El cliente fue creado correctamente.',
          timer: 1800,
          showConfirmButton: false
        });

        this.router.navigate(['/customers']);

      },

      error: (err) => {

        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message ?? 'No fue posible registrar el cliente.'
        });

      }

    });

  }

}