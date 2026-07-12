import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm {

  private fb = inject(FormBuilder);

  @Output() formSubmit = new EventEmitter<any>();

  productForm = this.fb.group({

    name: ['', Validators.required],

    description: ['', Validators.required],

    price: [0, [Validators.required, Validators.min(1)]],

    stock: [0, [Validators.required, Validators.min(0)]],

    categoryId: [null, Validators.required],

    imageUrl: [''],

    isActive: [true]

  });

  selectedFile: File | null = null;

  previewImage: string | ArrayBuffer | null = null;

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.previewImage = reader.result;

    };

    reader.readAsDataURL(this.selectedFile);

  }

  save() {

  console.log('Entró a save');

  console.log(this.productForm.valid);

  console.log(this.selectedFile);

  console.log(this.productForm.value);

  if (this.productForm.invalid || !this.selectedFile) {

    console.log('Formulario inválido o no hay archivo');

    this.productForm.markAllAsTouched();

    return;

  }

  console.log('Emitiendo evento');

  this.formSubmit.emit({

    product: this.productForm.value,

    file: this.selectedFile

  });

}

}