import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  DestroyRef,
  inject
} from '@angular/core';

import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';




import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';
import { SupplierTable } from '../../components/supplier-table/supplier-table';
import { SupplierFilters } from '../../components/supplier-filters/supplier-filters';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    SupplierTable,
SupplierFilters,
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css'
})
export class SupplierList {

  suppliers: Supplier[] = [];
  allSuppliers: Supplier[] = [];

  search = '';
  selectedStatus: boolean | null = null;

  private supplierService = inject(SupplierService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService
      .getSuppliers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (suppliers) => {
          this.suppliers = [...suppliers];
          this.allSuppliers = [...suppliers];
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
  }

  onSearch(value: string): void {
    this.search = value;
    this.applyFilters();
  }

  onStatus(status: boolean | null): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  clearFilters(): void {
    this.search = '';
    this.selectedStatus = null;
    this.suppliers = [...this.allSuppliers];
  }

  applyFilters(): void {
    this.suppliers = this.allSuppliers.filter(supplier => {

      const text = this.search.toLowerCase();

      const matchSearch =
        supplier.name.toLowerCase().includes(text) ||
        supplier.company.toLowerCase().includes(text) ||
        supplier.nit.toLowerCase().includes(text);

      const matchStatus =
        this.selectedStatus === null ||
        supplier.isActive === this.selectedStatus;

      return matchSearch && matchStatus;
    });
  }

  viewSupplier(supplier: Supplier): void {

    Swal.fire({
      title: supplier.name,
      html: `
        <p><strong>Empresa:</strong> ${supplier.company}</p>
        <p><strong>NIT:</strong> ${supplier.nit}</p>
        <p><strong>Email:</strong> ${supplier.email}</p>
        <p><strong>Teléfono:</strong> ${supplier.phone}</p>
        <p><strong>Dirección:</strong> ${supplier.address}</p>
        <p><strong>Contacto:</strong> ${supplier.contactPerson ?? '-'}</p>
        <p><strong>Observaciones:</strong> ${supplier.observations ?? '-'}</p>
      `,
      confirmButtonColor: '#2563eb'
    });

  }

  editSupplier(id: number): void {
    this.router.navigate(['/suppliers/edit', id]);
  }

  deleteSupplier(supplier: Supplier): void {

    Swal.fire({
      title: '¿Eliminar proveedor?',
      text: supplier.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.supplierService.delete(supplier.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor eliminado',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadSuppliers();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No fue posible eliminar el proveedor'
          });
        }
      });

    });

  }

}