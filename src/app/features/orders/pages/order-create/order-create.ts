import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { CustomerCard } from '../../components/customer-card/customer-card';
import { OrderProducts } from '../../components/order-products/order-products';
import { ProductCatalog } from '../../components/product-catalog/product-catalog';
import { OrderItem } from '../../models/order-item.model';
import { Product } from '../../../products/models/product.model';
import {  CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    ProductCatalog,
    CustomerCard,
    OrderProducts,
    CurrencyPipe,
    FormsModule
    
  ],
  templateUrl: './order-create.html',
  styleUrl: './order-create.css',
})
export class OrderCreate {

  
  items: OrderItem[] = [];
  private orderService = inject(OrderService);
  private router = inject(Router);
  selectedCustomer: any = null;
paymentMethod = 'Efectivo';
paymentStatus = 'Pendiente';
orderStatus ='Pendiente';



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
    return this.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
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
          <b>Total:</b>
          <h2 style="color:#198754">$${this.total.toLocaleString('es-CO')}</h2>
        </div>
      `,
    });

    if (!confirm.isConfirmed) return;

    // Construir pedido
    console.log('Método:', this.paymentMethod);
console.log('Estado del pago:', this.paymentStatus);
console.log('Estado de la orden:', this.orderStatus);
 const order = {
  customerId: this.selectedCustomer.id,
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

    console.log(order);

    Swal.fire({
      title: 'Guardando pedido...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.orderService.create(order).subscribe({
      next: () => {
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
        console.error(err);
        const message =
          err?.error?.message ||
          'No fue posible registrar el pedido.';

        Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          html: `
            <div style="font-size:16px">
              <i class="bi bi-box-seam text-danger fs-2"></i>
              <br><br>
              <strong>${message}</strong>
              <br><br>
              Verifica el inventario e intenta nuevamente.
            </div>
          `,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }
}