    
    
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import {
  Customer,
  CreateCustomerDto
} from '../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerForm implements OnChanges {

  //=========================================
  // Inyección de dependencias
  //=========================================

  private fb = inject(FormBuilder);
@Input()
buttonText = 'Guardar cliente';
  //=========================================
  // Inputs
  //=========================================

  @Input()
  customer: Customer | null = null;

  //=========================================
  // Outputs
  //=========================================

  @Output()
  save = new EventEmitter<CreateCustomerDto>();

  //=========================================
  // Reactive Form
  //=========================================

  customerForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(7)
      ]
    ],

    address: [
      '',
      [
        Validators.required,
        Validators.minLength(5)
      ]
    ],

    reference: [
      ''
    ],

    isActive: [
      true
    ]

  });

  //=========================================
  // Editar
  //=========================================

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['customer'] && this.customer) {

      this.customerForm.patchValue({

        name: this.customer.name,
        email: this.customer.email,
        phone: this.customer.phone,
        address: this.customer.address,
        reference: this.customer.reference ?? '',
        isActive: this.customer.isActive

      });

    }

  }

  //=========================================
  // Guardar
  //=========================================

  submit(): void {

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      return;

    }

    const form = this.customerForm.getRawValue();

    const customer: CreateCustomerDto = {

      name: form.name ?? '',
      email: form.email ?? '',
      phone: form.phone ?? '',
      address: form.address ?? '',
      reference: form.reference || null,
      isActive: form.isActive ?? true

    };

    this.save.emit(customer);

  }

  //=========================================
  // Validaciones
  //=========================================

  hasError(control: string): boolean {

    const field = this.customerForm.get(control);

    return !!field && field.invalid && field.touched;

  }

}