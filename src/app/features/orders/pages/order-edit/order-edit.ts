import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './order-edit.html',
  styleUrl: './order-edit.css'
})
export class OrderEdit implements OnInit {

  //==========================================
  // Dependencias
  //==========================================

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  //==========================================
  // Propiedades
  //==========================================

  orderId!: number;

  loading = false;

  saving = false;

  order?: Order;

  //==========================================
  // Formulario
  //==========================================

  form = this.fb.nonNullable.group({

    status: ['', Validators.required],

    paymentStatus: ['', Validators.required]

  });

  //==========================================
  // Inicializar
  //==========================================

  ngOnInit(): void {

    this.orderId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadOrder();

  }

  //==========================================
  // Cargar pedido
  //==========================================

  loadOrder(): void {

    this.loading = true;

    this.orderService.getOrder(this.orderId).subscribe({

      next: (order) => {

        this.order = order;

        this.form.patchValue({

          status: order.status,

          paymentStatus: order.paymentStatus

        });

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible cargar el pedido.'
        });

      }

    });

  }

  //==========================================
  // Guardar cambios
  //==========================================

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Debe completar todos los campos.'
      });

      return;

    }

    this.saving = true;

    const data = this.form.getRawValue();

    this.orderService.update(this.orderId, data).subscribe({

      next: () => {

        this.saving = false;

        Swal.fire({
          icon: 'success',
          title: '¡Pedido actualizado!',
          text: 'Los cambios se guardaron correctamente.',
          confirmButtonColor: '#198754'
        }).then(() => {

          this.router.navigate(['/orders']);

        });

      },

      error: () => {

        this.saving = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible actualizar el pedido.',
          confirmButtonColor: '#dc3545'
        });

      }

    });

  }

  //==========================================
  // Cancelar
  //==========================================

  cancel(): void {

    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Continuar editando',
      confirmButtonColor: '#6c757d'
    }).then(result => {

      if (result.isConfirmed) {

        this.router.navigate(['/orders']);

      }

    });

  }

}