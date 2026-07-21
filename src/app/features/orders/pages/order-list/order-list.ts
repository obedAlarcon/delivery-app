import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import Swal from 'sweetalert2';

import { Order } from '../../models/order.model';

import { OrderService } from '../../services/order.service';


import { OrderFilters } from '../../components/order-filters/order-filters';
import { OrderTable } from '../../components/order-table/order-table';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    OrderFilters,
    OrderTable
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList {

  //==========================================
  // Datos
  //==========================================

  orders: Order[] = [];

  allOrders: Order[] = [];

  search = '';

  //==========================================
  // Dependencias
  //==========================================

  private orderService = inject(OrderService);

  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  private destroyRef = inject(DestroyRef);

  //==========================================
  // Inicialización
  //==========================================

  ngOnInit(): void {

    this.loadOrders();

  }

  //==========================================
  // Obtener pedidos
  //==========================================

  loadOrders(): void {

    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (orders) => {

          this.orders = [...orders];

          this.allOrders = [...orders];

          this.cdr.detectChanges();

        },

        error: (err) => console.error(err)

      });

  }

  //==========================================
  // Buscar
  //==========================================

  onSearch(value: string): void {

    this.search = value;

    this.applyFilters();

  }

  //==========================================
  // Aplicar filtros
  //==========================================

  applyFilters(): void {

    const text = this.search.toLowerCase();

    this.orders = this.allOrders.filter(order =>

      order.id.toString().includes(text)

      ||

      order.customer?.name
        ?.toLowerCase()
        .includes(text)

      ||

      order.customer?.phone
        ?.toLowerCase()
        .includes(text)

      ||

      order.status
        .toLowerCase()
        .includes(text)

    );

  }

  //==========================================
  // Limpiar
  //==========================================

  clearFilters(): void {

    this.search = '';

    this.orders = [...this.allOrders];

  }

  //==========================================
  // Ver pedido
  //==========================================

  viewOrder(id: number): void {

    this.router.navigate(['/orders/detail', id]);

  }

  //==========================================
  // Editar
  //==========================================

  editOrder(id: number): void {

    this.router.navigate(['/orders/edit', id]);

  }

  //==========================================
  // Eliminar
  //==========================================

  deleteOrder(id: number): void {

    Swal.fire({

      title: '¿Eliminar pedido?',

      text: 'Esta acción no se puede deshacer.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Eliminar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#dc2626',

      cancelButtonColor: '#64748b'

    }).then(result => {

      if (!result.isConfirmed) return;

      this.orderService.delete(id).subscribe({

        next: () => {

          Swal.fire({

            icon: 'success',

            title: 'Pedido eliminado',

            timer: 1500,

            showConfirmButton: false

          });

          this.loadOrders();

        },

        error: () => {

          Swal.fire({

            icon: 'error',

            title: 'No fue posible eliminar el pedido'

          });

        }

      });

    });

  }

}