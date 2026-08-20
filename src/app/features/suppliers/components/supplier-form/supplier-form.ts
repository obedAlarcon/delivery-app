import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
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

import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnChanges {

  private fb = inject(FormBuilder);

  @Input() supplier: Supplier | null = null;

  @Output() save = new EventEmitter<any>();

  supplierForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    company: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    nit: [
      '',
      Validators.required
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
      Validators.required
    ],

    address: [
      '',
      Validators.required
    ],

    contactPerson: [
      ''
    ],

    observations: [
      ''
    ],

    isActive: [
      true
    ]

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['supplier'] && this.supplier) {

      this.supplierForm.patchValue({

        name: this.supplier.name,
        company: this.supplier.company,
        nit: this.supplier.nit,
        email: this.supplier.email,
        phone: this.supplier.phone,
        address: this.supplier.address,
        contactPerson: this.supplier.contactPerson ?? '',
        observations: this.supplier.observations ?? '',
        isActive: this.supplier.isActive

      });

    }

  }

submit(): void {

  console.log('SUBMIT EJECUTADO');

  if (this.supplierForm.invalid) {

    console.log(this.supplierForm.value);
    console.log(this.supplierForm.errors);
    console.log(this.supplierForm);

    this.supplierForm.markAllAsTouched();

    return;

  }

  this.save.emit(this.supplierForm.getRawValue());

}

hasError(control: string): boolean {

  const field = this.supplierForm.get(control);

  return !!field && field.invalid && field.touched;

}



}