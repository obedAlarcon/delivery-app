import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { OrderProducts } from '../order-products/order-products';
import { OrderItem } from '../../models/order-item.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css'
})
export class OrderForm {
items: OrderItem[] = [];
  private fb = inject(FormBuilder);
  private orderService=inject(OrderService);

  form: FormGroup = this.fb.group({

    customer: this.fb.group({

      name: ['', Validators.required],

      phone: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      address: ['', Validators.required],

      reference: ['']

    }),

    paymentMethod: [
      'efectivo',
      Validators.required
    ]

  });



  total = 0;

save(): void {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    return;

  }

  if (this.items.length === 0) {

    alert('Debe agregar al menos un producto.');

    return;

  }

  const order = {

    customer: this.form.value.customer,

    paymentMethod: this.form.value.paymentMethod,

    items: this.items.map(item => ({

      productId: item.productId,

      quantity: item.quantity,

      price: item.price

    }))

  };

  this.orderService.create(order).subscribe({

    next: (response) => {

      console.log(response);

      alert('Pedido registrado correctamente.');

    },

    error: (error) => {

      console.error(error);

      alert('Ocurrió un error al guardar el pedido.');

    }

  });

}
 onItemsChange(items: OrderItem[]): void {

  this.items = items;

  this.total = this.items.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

}

}