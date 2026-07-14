import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import {  Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { ProductForm } from '../../components/product-form/product-form';
import { Category } from '../../../categories/models/category.model';




@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
   ProductForm,
   
  ],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEdit {

  product: Product | null = null;

  categories:Category[] = [];

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadCategories();

    this.productService.getById(id).subscribe({

      next: (product) => {

        this.product = product;

      },

      error: () => {

        Swal.fire({

          icon: 'error',

          title: 'Producto no encontrado'

        });

        this.router.navigate(['/products']);

      }

    });

  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (categories) => {

        this.categories = categories;

      }

    });

  }

save(event: { product: any; file: File | null }): void {

  if (!this.product) return;

  const product = event.product;

  const file = event.file;

  // Si seleccionó una imagen nueva
  if (file) {

    this.productService.uploadImage(file).subscribe({

      next: (response) => {

        product.imageUrl = response.imageUrl;

        this.updateProduct(product);

      },

      error: () => {

        Swal.fire({

          icon: 'error',

          title: 'Error al subir la imagen'

        });

      }

    });

    return;

  }

  // Si no cambió la imagen
  product.imageUrl = this.product.imageUrl;

  this.updateProduct(product);

}
private updateProduct(product: any): void {

  this.productService.update(this.product!.id, product).subscribe({

    next: () => {

      Swal.fire({

        icon: 'success',

        title: 'Producto actualizado',

        timer: 1500,

        showConfirmButton: false

      });

      this.router.navigate(['/products']);

    },

    error: () => {

      Swal.fire({

        icon: 'error',

        title: 'Error al actualizar'

      });

    }

  });

}
}