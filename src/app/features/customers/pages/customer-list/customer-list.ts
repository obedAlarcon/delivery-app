import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router} from '@angular/router';
import Swal from 'sweetalert2';

import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { CustomerTable } from '../../components/customer-table/customer-table';
import { CustomerFilters } from '../../components/customer-filters/customer-filters';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CustomerTable,
    CustomerFilters
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {

  private customerService = inject(CustomerService);
  private router = inject(Router);
  
  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];
 
filteredCustomers: Customer[] = [];

  ngOnInit(): void {
    this.loadCustomers();
    
  }
  

  loadCustomers(): void {

    this.customerService.getCustomers().subscribe({

      next: (customers) => {

        this.customers = customers;
this.filteredCustomers = [...customers];

 this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(err);

      }

    });

  }
  

  view(customer: Customer): void {

    Swal.fire({
      title: customer.name,
      html: `
        <div style="text-align:center">
         <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Teléfono:</strong> ${customer.phone}</p>
          <p><strong>Dirección:</strong> ${customer.address}</p>
          <p><strong>Referencia:</strong> ${customer.reference ?? '-'}</p>
        </div>
      `
    });

  }

  edit(id: number): void {

    this.router.navigate(['/customers/edit', id]);

  }

  async delete(customer: Customer): Promise<void> {

    const result = await Swal.fire({

      title: '¿Eliminar cliente?',

      text: customer.name,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Eliminar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#dc3545'

    });

    if (!result.isConfirmed) return;

    this.customerService.delete(customer.id).subscribe({

      next: () => {

        this.loadCustomers();

        Swal.fire({

          icon: 'success',

          title: 'Cliente eliminado',

          timer: 1500,

          showConfirmButton: false

        });

      },

      error: (err) => {

        console.error(err);

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text: err?.error?.message ?? 'No fue posible eliminar el cliente.'

        });

      }

    });

  }
onSearch(search: string): void {

  const value = search.toLowerCase().trim();

  this.filteredCustomers = this.customers.filter(c =>
    c.name.toLowerCase().includes(value) ||
    c.email.toLowerCase().includes(value) ||
    c.phone.toLowerCase().includes(value)
  );

}

onStatus(status: boolean | null): void {

  if (status === null) {
    this.filteredCustomers = [...this.customers];
    return;
  }

  this.filteredCustomers = this.customers.filter(
    c => c.isActive === status
  );

}

clearFilters(): void {

  this.filteredCustomers = [...this.customers];

}
}