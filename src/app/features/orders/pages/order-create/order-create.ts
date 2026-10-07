import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { CustomerCard } from '../../components/customer-card/customer-card';
import { OrderProducts } from '../../components/order-products/order-products';
import { ProductCatalog } from '../../components/product-catalog/product-catalog';
import { OrderItem } from '../../models/order-item.model';
import { Product } from '../../../products/models/product.model';
import {  CommonModule, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreditService } from '../../../credits/credit-service';


@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    ProductCatalog,
    CustomerCard,
    OrderProducts,
    CurrencyPipe,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './order-create.html',
  styleUrl: './order-create.css',
})
export class OrderCreate {

  
  items: OrderItem[] = [];
  private orderService = inject(OrderService);
  private router = inject(Router);
  private creditService = inject(CreditService);
  selectedCustomer: any = null;
paymentMethod = 'Efectivo';
paymentStatus = 'Pendiente';
orderStatus = 'Pendiente';

numeroCuotas = 4;
porcentajeCredito = 10;

get isCredit(): boolean {
  return this.paymentMethod === 'Crédito';
}

get totalCredito(): number {
  if (!this.isCredit) {
    return this.total;
  }

  return this.total * (1 + this.porcentajeCredito / 100);
}

get valorCuota(): number {
  if (!this.isCredit || this.numeroCuotas <= 0) {
    return 0;
  }

  return this.totalCredito / this.numeroCuotas;
}

get totalPagado(): number {
  return 0;
}
  addProduct(product: Product): void {

    const exists = this.items.find(
      item => item.productId === product.id
    );

    if (exists) {
      exists.quantity++;
      exists.subtotal = exists.quantity * exists.price;
    } else {
      this.items.push({
        productId: product.id,
        quantity: 1,
        price: product.price,
        subtotal: product.price,
        product: {                    // ✅ name va dentro de product
          id: product.id,
          name: product.name,
          price: product.price
        }
      });
    }
  }

  onCustomerSelected(customer: any): void {
    this.selectedCustomer = customer;
    console.log('Cliente seleccionado:', customer);
    
  }

  increase(item: OrderItem): void {
    item.quantity++;
    item.subtotal = item.quantity * item.price;
  }

  decrease(item: OrderItem): void {
    if (item.quantity === 1) {
      this.remove(item);
      return;
    }
    item.quantity--;
    item.subtotal = item.quantity * item.price;
  }

  remove(item: OrderItem): void {
    this.items = this.items.filter(i => i !== item);
  }

 get total(): number {
    return this.items.reduce((sum, item) => {
        const price = item.product?.price ?? 0;
        const quantity = item.quantity ?? 0;

        return sum + (price * quantity);
    }, 0);
}

  async saveOrder(): Promise<void> {

    // Validar cliente
    if (!this.selectedCustomer) {
      await Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Debe seleccionar un cliente.',
        confirmButtonColor: '#0d6efd',
      });
      return;

      
    }

    // Validar productos
    if (this.items.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Debe agregar al menos un producto.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    // Confirmar pedido
    const totalProductos = this.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const confirm = await Swal.fire({
  title: '¿Registrar pedido?',
  html: `
    <div style="text-align:left">
      <b>Cliente:</b><br>
      ${this.selectedCustomer.name}

      <br><br>

      <b>Productos:</b> ${totalProductos}

      <br><br>

      <b>Método de pago:</b>
      ${this.paymentMethod}

      <br><br>

      ${
        this.isCredit
          ? `
            <b>Precio de contado:</b>
            $${this.total.toLocaleString('es-CO')}

            <br>

            <b>Incremento:</b>
            ${this.porcentajeCredito}%

            <br>

            <b>Total a crédito:</b>
            <h2 style="color:#198754">
              $${this.totalCredito.toLocaleString('es-CO')}
            </h2>

            <b>Cuotas:</b>
            ${this.numeroCuotas}

            <br>
               <b>Total pagado:</b>
            $${this.totalPagado.toLocaleString('es-CO')}
            <br>


            <b>Valor por cuota:</b>
            $${this.valorCuota.toLocaleString('es-CO')}
          `
          : `
            <b>Total:</b>
            <h2 style="color:#198754">
              $${this.total.toLocaleString('es-CO')}
            </h2>
          `
      }
    </div>
  `,
  showCancelButton: true,
  confirmButtonText: 'Registrar',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#198754'
});

    if (!confirm.isConfirmed) return;

    // Construir pedido
 console.log('Método:', this.paymentMethod);
console.log('Estado del pago:', this.paymentStatus);
console.log('Estado de la orden:', this.orderStatus);


const order = {
  customer: {
    name: this.selectedCustomer.name,
    email: this.selectedCustomer.email,
    phone: this.selectedCustomer.phone,
    address: this.selectedCustomer.address,
    reference: this.selectedCustomer.reference
  },

  deliveryAddress: this.selectedCustomer.address,
  deliveryReference: this.selectedCustomer.reference,

  paymentMethod: this.paymentMethod,
  paymentStatus: this.paymentStatus,
  status: this.orderStatus,

  items: this.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price
  }))
};
console.log(order);

    

    Swal.fire({
      title: 'Guardando pedido...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
this.orderService.create(order).subscribe({

  next: (createdOrder) => {
 console.log('Pedido creado:', createdOrder);
  console.log('ID del pedido:', createdOrder.id);
    // ==========================================
    // SI ES CRÉDITO, CREAR EL REGISTRO DE CRÉDITO
    // ==========================================

    if (this.isCredit) {

      const credit = {
  orderId: createdOrder.id,
  precioContado: this.total,
  porcentajeIncremento: this.porcentajeCredito,
  totalCredito: this.totalCredito,
  numeroCuotas: this.numeroCuotas,
  valorCuota: this.valorCuota,
  fechaProximoPago: new Date().toISOString(),
  totalPagado:this.totalPagado,
  estado: 'Pendiente' as const
};
console.log('CRÉDITO:', credit);
      this.creditService.createCredit(credit).subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: '¡Pedido registrado!',
            text: 'El pedido y el crédito fueron registrados correctamente.',
            timer: 1800,
            showConfirmButton: false
          });

          this.items = [];
          this.selectedCustomer = null;

          this.router.navigate(['/orders']);
        },

        error: (err) => {

          console.error(
            'Error creando crédito:',
            err
          );

          Swal.fire({
            icon: 'warning',
            title: 'Pedido guardado',
            text: 'El pedido fue guardado, pero no se pudo registrar el crédito.',
            confirmButtonText: 'Aceptar'
          });

        }

      });

      return;
    }


    // ==========================================
    // PEDIDO NORMAL
    // ==========================================

    Swal.fire({
      icon: 'success',
      title: '¡Pedido registrado!',
      text: 'La venta fue registrada correctamente.',
      timer: 1800,
      showConfirmButton: false
    });

    this.items = [];
    this.selectedCustomer = null;

    this.router.navigate(['/orders']);

  },

  error: (err) => {

    console.error('Error completo:', err);
    console.error('Error body:', err?.error);

    const message =
      err?.error?.message ||
      err?.message ||
      'No fue posible registrar el pedido.';

    Swal.fire({
      icon: 'error',
      title: 'Error al guardar pedido',
      text: message,
      confirmButtonText: 'Aceptar'
    });

  }

});


  }

  
}