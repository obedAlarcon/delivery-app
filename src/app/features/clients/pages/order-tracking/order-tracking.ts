import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { OrderService } from '../../../orders/services/order.service';
import { Order } from '../../../orders/models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './order-tracking.html',
  styleUrl: './order-tracking.css'
})
export class OrderTracking implements OnInit {

  //==================================================
  // DEPENDENCIAS
  //==================================================

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  private cdr = inject(ChangeDetectorRef);
  //==================================================
  // DATOS
  //==================================================

  order: Order | null = null;

  loading = false;


  //==================================================
  // INICIALIZAR
  //==================================================

  ngOnInit(): void {

    this.loadOrder();

  }


  //==================================================
  // CARGAR PEDIDO
  //==================================================

  loadOrder(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log(
      'ID DEL PEDIDO:',
      id
    );


    //===============================================
    // VALIDAR ID
    //===============================================

    if (!id) {

      Swal.fire({
        icon: 'error',
        title: 'Pedido no válido',
        text: 'No se encontró el número del pedido.',
        confirmButtonText: 'Aceptar'
      });

      return;

    }


    //===============================================
    // CARGANDO
    //===============================================

    this.loading = true;


    //===============================================
    // CONSULTAR PEDIDO
    //===============================================

    this.orderService
      .getOrder(id)
      .subscribe({

        next: (order) => {

          console.log(
            'PEDIDO CARGADO:',
            order
          );

          this.order = order;

          this.loading = false;
 this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'ERROR AL CARGAR PEDIDO:',
            error
          );

          this.order = null;

          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Pedido no encontrado',
            text: 'No fue posible consultar este pedido.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#dc3545'
          });

        }

      });

  }


  //==================================================
  // ESTADO ACTUAL
  //==================================================

  getCurrentStep(): number {

    if (!this.order) {
      return 1;
    }

    switch (
      this.order.status?.toLowerCase()
    ) {

      case 'pendiente':
        return 1;

      case 'confirmado':
      case 'preparando':
      case 'en preparación':
      case 'en preparacion':
        return 2;

      case 'en camino':
        return 3;

      case 'entregado':
        return 4;

      default:
        return 1;

    }

  }


  //==================================================
  // CLASE DEL PASO
  //==================================================

  getStepClass(step: number): string {

    const current = this.getCurrentStep();

    if (step < current) {
      return 'completed';
    }

    if (step === current) {
      return 'active';
    }

    return '';

  }


  //==================================================
  // TOTAL PRODUCTOS
  //==================================================

  getTotalItems(): number {

    if (!this.order?.orderDetails) {
      return 0;
    }

    return this.order.orderDetails.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  }


  //==================================================
  // MÉTODO DE PAGO
  //==================================================

  getPaymentMethod(
    method: string
  ): string {

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

}