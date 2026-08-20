import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  ClientCartService,
  CartItem
} from '../../services/client-cart.service';
import { OrderService } from '../../../orders/services/order.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  //==================================================
  // CARRITO
  //==================================================

  items: CartItem[] = [];

  //==================================================
  // TOTALES
  //==================================================

  subtotal = 0;
  shipping = 0;
  total = 0;

  //==================================================
  // ESTADO
  //==================================================

  isSubmitting = false;

  //==================================================
  // DATOS DEL CLIENTE
  //==================================================

  customer = {

    name: '',

    email: '',

    phone: '',

    address: '',

    neighborhood: '',

    notes: '',

    paymentMethod: 'cash'

  };

  //==================================================
  // CONSTRUCTOR
  //==================================================

  constructor(

    private readonly cartService: ClientCartService,

    private readonly orderService: OrderService,

    private readonly router: Router

  ) {}

  //==================================================
  // INIT
  //==================================================

  ngOnInit(): void {

    this.cartService.cart$.subscribe(items => {

      this.items = items;

      this.calculateTotals();

    });

  }

  //==================================================
  // CALCULAR TOTALES
  //==================================================

  calculateTotals(): void {

    this.subtotal = this.cartService.getSubtotal();

    // Por ahora el envío es gratis
    this.shipping = 0;

    this.total = this.subtotal + this.shipping;

  }

  //==================================================
  // AUMENTAR CANTIDAD
  //==================================================

  increaseQuantity(productId: number): void {

    this.cartService.increaseQuantity(productId);

  }

  //==================================================
  // DISMINUIR CANTIDAD
  //==================================================

  decreaseQuantity(productId: number): void {

    this.cartService.decreaseQuantity(productId);

  }

  //==================================================
  // ELIMINAR PRODUCTO
  //==================================================

  removeItem(productId: number): void {

    this.cartService.removeFromCart(productId);

  }

  //==================================================
  // VALIDAR CHECKOUT
  //==================================================

  private validateCheckout(): boolean {

    if (!this.customer.name.trim()) {

      alert('Ingresa tu nombre completo.');

      return false;

    }

    if (!this.customer.email.trim()) {

      alert('Ingresa tu correo electrónico.');

      return false;

    }

    if (!this.customer.phone.trim()) {

      alert('Ingresa tu teléfono.');

      return false;

    }

    if (!this.customer.neighborhood.trim()) {

      alert('Ingresa tu barrio.');

      return false;

    }

    if (!this.customer.address.trim()) {

      alert('Ingresa tu dirección.');

      return false;

    }

    if (!this.customer.paymentMethod) {

      alert('Selecciona un método de pago.');

      return false;

    }

    return true;

  }

  //==================================================
  // CONFIRMAR PEDIDO
  //==================================================



async confirmOrder(): Promise<void> {

  //==================================================
  // EVITAR DOBLE CLIC
  //==================================================

  if (this.isSubmitting) {
    return;
  }


  //==================================================
  // VALIDAR CARRITO
  //==================================================

  if (this.items.length === 0) {

    await Swal.fire({

      icon: 'warning',

      title: 'Carrito vacío',

      text: 'Agrega al menos un producto antes de continuar.',

      confirmButtonText: 'Aceptar',

      confirmButtonColor: '#0d6efd'

    });

    return;
  }


  //==================================================
  // VALIDAR DATOS
  //==================================================

  if (!this.validateCheckout()) {
    return;
  }


  //==================================================
  // CONFIRMAR PEDIDO
  //==================================================

  const totalProductos = this.items.reduce(

    (sum, item) =>
      sum + item.quantity,

    0

  );


  const confirm = await Swal.fire({

    title: '¿Confirmar pedido?',

    html: `

      <div style="text-align:left">

        <b>Cliente:</b><br>

        ${this.customer.name}

        <br><br>

        <b>Productos:</b>

        ${totalProductos}

        <br><br>

        <b>Método de pago:</b><br>

        ${
          this.customer.paymentMethod === 'cash'
            ? 'Efectivo'
            : this.customer.paymentMethod === 'transfer'
              ? 'Transferencia'
              : 'Contraentrega'
        }

        <br><br>

        <b>Total:</b>

        <h2 style="color:#198754">

          $${this.total.toLocaleString('es-CO')}

        </h2>

      </div>

    `,

    icon: 'question',

    showCancelButton: true,

    confirmButtonText: 'Sí, confirmar',

    cancelButtonText: 'Cancelar',

    confirmButtonColor: '#198754',

    cancelButtonColor: '#6c757d'

  });


  if (!confirm.isConfirmed) {

    return;

  }


  //==================================================
  // BLOQUEAR ENVÍO
  //==================================================

  this.isSubmitting = true;


  //==================================================
  // PREPARAR PEDIDO
  //==================================================

  const order = {

    customer: {

      name:
        this.customer.name.trim(),

      email:
        this.customer.email.trim().toLowerCase(),

      phone:
        this.customer.phone.trim(),

      address:
        this.customer.address.trim(),

      reference:
        this.customer.neighborhood.trim()

    },


    deliveryAddress:
      this.customer.address.trim(),


    deliveryReference:

      `${this.customer.neighborhood.trim()}${
        this.customer.notes.trim()
          ? ' - ' + this.customer.notes.trim()
          : ''
      }`,


    paymentMethod:
      this.customer.paymentMethod,


    paymentStatus:
      'Pendiente',


    status:
      'Pendiente',


    items:

      this.items.map(item => ({

        productId:
          item.product.id,

        quantity:
          item.quantity,

        price:
          Number(item.product.price)

      }))

  };


  console.log(
    'ENVIANDO PEDIDO:',
    order
  );


  //==================================================
  // MOSTRAR CARGANDO
  //==================================================

  Swal.fire({

    title: 'Procesando pedido...',

    text: 'Estamos registrando tu pedido.',

    allowOutsideClick: false,

    allowEscapeKey: false,

    didOpen: () => {

      Swal.showLoading();

    }

  });


  //==================================================
  // ENVIAR AL BACKEND
  //==================================================

  this.orderService.create(order).subscribe({

    //===============================================
    // ÉXITO
    //===============================================

    next: async (response) => {

      console.log(
        'PEDIDO CREADO:',
        response
      );


      //=============================================
      // GUARDAR EMAIL DEL CLIENTE
      //=============================================

      localStorage.setItem(

        'customerEmail',

        this.customer.email
          .trim()
          .toLowerCase()

      );


      //=============================================
      // VACIAR CARRITO
      //=============================================

      this.cartService.clearCart();


      //=============================================
      // LIBERAR ESTADO
      //=============================================

      this.isSubmitting = false;


      //=============================================
      // MENSAJE DE ÉXITO
      //=============================================

      await Swal.fire({

        icon: 'success',

        title: '¡Pedido realizado!',

        text:
          `Tu pedido #${response.id} fue registrado correctamente.`,

        confirmButtonText: 'Ver mis pedidos',

        confirmButtonColor: '#198754'

      });


      //=============================================
      // IR AL HISTORIAL
      //=============================================

      this.router.navigate([

        '/client/order-history'

      ]);

    },


    //===============================================
    // ERROR
    //===============================================

    error: async (error) => {

      console.error(

        'ERROR AL CREAR PEDIDO:',

        error

      );


      this.isSubmitting = false;


      const message =

        error?.error?.message ||

        error?.message ||

        'No fue posible realizar el pedido.';


      await Swal.fire({

        icon: 'error',

        title: 'No se pudo realizar el pedido',

        html: `

          <div style="font-size:16px">

            <i class="bi bi-exclamation-triangle text-danger fs-2"></i>

            <br><br>

            <strong>${message}</strong>

            <br><br>

            Verifica los datos e intenta nuevamente.

          </div>

        `,

        confirmButtonText: 'Aceptar',

        confirmButtonColor: '#dc3545'

      });

    }

  });

}






}