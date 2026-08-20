import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Swal from 'sweetalert2';

import { Purchase } from '../../models/purchase.model';
import { PurchaseService } from '../../services/purchase.service';

import { PurchaseFilters } from '../../components/purchase-filters/purchase-filters';
import { PurchaseTable } from '../../components/purchase-table/purchase-table';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [
    CommonModule,
 PurchaseTable,
 
PurchaseFilters
  ],
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.css'
})
export class PurchaseList implements OnInit {

  //=========================================
  // Datos
  //=========================================

  purchases: Purchase[] = [];

  allPurchases: Purchase[] = [];

  //=========================================
  // Filtros
  //=========================================

  search = '';

  selectedStatus = '';

  //=========================================
  // Dependencias
  //=========================================

  private purchaseService = inject(PurchaseService);

  private cdr = inject(ChangeDetectorRef);

  private destroyRef = inject(DestroyRef);

  private router = inject(Router);

  //=========================================
  // Inicio
  //=========================================

  ngOnInit(): void {

    this.loadPurchases();

  }

  //=========================================
  // Cargar compras
  //=========================================

  loadPurchases(): void {

    this.purchaseService
      .getPurchases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (purchases) => {
       console.log('COMPRAS:', purchases);
          this.allPurchases = [...purchases];

          this.purchases = [...purchases];

          this.cdr.detectChanges();

        },

        error: (err) => console.error(err)

      });

  }

  //=========================================
  // Buscar
  //=========================================

  onSearch(value: string): void {

    this.search = value;

    this.applyFilters();

  }

  //=========================================
  // Estado
  //=========================================

  onStatus(status: string): void {

    this.selectedStatus = status;

    this.applyFilters();

  }

  //=========================================
  // Limpiar filtros
  //=========================================

  clearFilters(): void {

    this.search = '';

    this.selectedStatus = '';

    this.purchases = [...this.allPurchases];

  }

  //=========================================
  // Aplicar filtros
  //=========================================

  applyFilters(): void {

    this.purchases = this.allPurchases.filter(purchase => {

      const matchInvoice =
        purchase.invoiceNumber
          .toLowerCase()
          .includes(this.search.toLowerCase());

      const matchSupplier =
        purchase.supplier?.name
          ?.toLowerCase()
          .includes(this.search.toLowerCase()) ?? false;

      const matchStatus =
        !this.selectedStatus ||
        purchase.status === this.selectedStatus;

      return (matchInvoice || matchSupplier) && matchStatus;

    });

  }
createPurchase(){

  this.router.navigate([
    '/purchases/create'
  ]);

}
  //=========================================
  // Ver compra
  //=========================================

  viewPurchase(purchase: Purchase): void {

    this.router.navigate(['/purchases/detail', purchase.id]);

  }

  //=========================================
  // Editar
  //=========================================

  editPurchase(id: number): void {

    this.router.navigate(['/purchases/edit', id]);

  }

  //=========================================
  // Eliminar
  //=========================================

cancelPurchase(purchase: Purchase): void {

  Swal.fire({

    title: '¿Cancelar compra?',

    text: `Factura: ${purchase.invoiceNumber}`,

    icon: 'warning',

    showCancelButton: true,

    confirmButtonText: 'Sí, cancelar',

    cancelButtonText: 'No',

    confirmButtonColor: '#dc2626',

    cancelButtonColor: '#64748b'

  }).then(result => {

    if (!result.isConfirmed) return;

    this.purchaseService.update(purchase.id, {

      status: 'Cancelada'

    }).subscribe({

      next: () => {

        Swal.fire({

          icon: 'success',

          title: 'Compra cancelada',

          timer: 1500,

          showConfirmButton: false

        });

        this.loadPurchases();

      },

      error: () => {

        Swal.fire({

          icon: 'error',

          title: 'No fue posible cancelar la compra'

        });

      }

    });

  });

}
}