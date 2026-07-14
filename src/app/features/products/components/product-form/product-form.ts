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

import { Product } from '../../models/product.model';
import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnChanges {

  //=========================================
  // Inyección de dependencias
  //=========================================

  private fb = inject(FormBuilder);

  //=========================================
  // Inputs
  //=========================================

  @Input() product: Product | null = null;

  @Input() categories: Category[] = [];

  //=========================================
  // Output
  //=========================================

  @Output() save = new EventEmitter<{
    product: any;
    file: File | null;
  }>();

  //=========================================
  // Imagen
  //=========================================

  selectedFile: File | null = null;

  previewImage: string | null = null;

  //=========================================
  // Reactive Form
  //=========================================

  productForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    description: [
      '',
      Validators.required
    ],

    price: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    stock: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    categoryId: [
      0,
      Validators.required
    ],

    isActive: [
      true
    ]

  });

  //=========================================
  // Editar
  //=========================================

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['product'] && this.product) {

      this.productForm.patchValue({

        name: this.product.name,

        description: this.product.description,

        price: this.product.price,

        stock: this.product.stock,

        categoryId: this.product.categoryId,

        isActive: this.product.isActive

      });

      this.previewImage = this.product.imageUrl;

    }

  }

  //=========================================
  // Seleccionar imagen
  //=========================================

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {

      alert('Seleccione una imagen válida.');

      return;

    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.previewImage = reader.result as string;

    };

    reader.readAsDataURL(file);

  }

  //=========================================
  // Eliminar imagen
  //=========================================

  removeImage(): void {

    this.selectedFile = null;

    this.previewImage = null;

  }

  //=========================================
  // Guardar
  //=========================================

  submit(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }

    this.save.emit({

      product: this.productForm.getRawValue(),

      file: this.selectedFile

    });

  }

  //=========================================
  // Validaciones
  //=========================================

  hasError(control: string): boolean {

    const field = this.productForm.get(control);

    return !!field && field.invalid && field.touched;

  }

}