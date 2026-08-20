import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderService } from '../../../orders/services/order.service';
import { Order } from '../../../orders/models/order.model';



@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    
  ],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory implements OnInit {

  //==================================================
  // DEPENDENCIAS
  //==================================================

  private orderService = inject(OrderService);
private cdr = inject(ChangeDetectorRef);

  //==================================================
  // DATOS
  //==================================================

  orders: Order[] = [];

  loading = false;

  customerEmail = '';


  //==================================================
  // INICIALIZAR
  //==================================================

  ngOnInit(): void {

    this.loadOrders();

  }


  //==================================================
  // CARGAR PEDIDOS DEL CLIENTE
  //==================================================





loadOrders(): void {

  this.customerEmail =
    localStorage.getItem('customerEmail') || '';

  console.log(
    'EMAIL CLIENTE:',
    this.customerEmail
  );

  if (!this.customerEmail) {

    this.orders = [];
    this.loading = false;

    return;
  }

  this.loading = true;

  this.orderService
    .getOrdersByCustomerEmail(this.customerEmail)
    .subscribe({

      next: (orders) => {

        console.log(
          'PEDIDOS DEL CLIENTE:',
          orders
        );

        this.orders = orders || [];

        console.log(
          'ORDERS ASIGNADOS:',
          this.orders
        );

        this.loading = false;

  this.cdr.detectChanges();
        console.log(
          'LOADING:',
          this.loading
        );

      },

      error: (error) => {

        console.error(
          'ERROR AL CARGAR PEDIDOS:',
          error
        );

        this.orders = [];

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los pedidos',
          text: 'Ocurrió un problema al consultar tus pedidos.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });

      }

    });

}




  
 

  //==================================================
  // TOTAL DE PRODUCTOS
  //==================================================

getTotalItems(order: Order): number {

  if (!order.orderDetails) {
    return 0;
  }

  return order.orderDetails.reduce(
    (total, item) => total + item.quantity,
    0
  );

}

  //==================================================
  // TEXTO DEL ESTADO
  //==================================================

  getStatusClass(status: string): string {

    switch (status?.toLowerCase()) {

      case 'pendiente':
        return 'status-pending';

      case 'confirmado':
        return 'status-confirmed';

      case 'en preparación':
      case 'en preparacion':
        return 'status-preparing';

      case 'en camino':
        return 'status-delivery';

      case 'entregado':
        return 'status-delivered';

      case 'cancelado':
        return 'status-cancelled';

      default:
        return 'status-default';

    }

  }


  //==================================================
  // MÉTODO DE PAGO
  //==================================================

  getPaymentMethod(method: string): string {

    switch (method) {

      case 'cash':
        return 'Efectivo';

      case 'transfer':
        return 'Transferencia';

      case 'delivery':
        return 'Contraentrega';

      default:
        return method;

    }

  }


  //==================================================
  // VER PEDIDO
  //==================================================

  viewOrder(orderId: number): void {

    console.log(
      'VER PEDIDO:',
      orderId
    );

  }

}