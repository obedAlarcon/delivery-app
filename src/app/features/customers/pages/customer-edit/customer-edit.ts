import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CustomerForm } from '../../components/customer-form/customer-form';
import {
  Customer,
  UpdateCustomerDto
} from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [
    CustomerForm
  ],
  templateUrl: './customer-edit.html',
  styleUrl: './customer-edit.css'
})
export class CustomerEdit implements OnInit {

  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  customer: Customer | null = null;

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/customers']);
      return;
    }

    this.customerService.getCustomer(id).subscribe({

      next: (customer) => {

        this.customer = customer;

      },

      error: () => {

        Swal.fire({
          icon: 'error',
          title: 'Cliente no encontrado'
        });

        this.router.navigate(['/customers']);

      }

    });

  }

  save(customer: UpdateCustomerDto): void {

    if (!this.customer) return;

    this.customerService.update(this.customer.id, customer).subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Cliente actualizado',
          text: 'Los datos fueron actualizados correctamente.',
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
          text: err?.error?.message ?? 'No fue posible actualizar el cliente.'
        });

      }

    });

  }

}