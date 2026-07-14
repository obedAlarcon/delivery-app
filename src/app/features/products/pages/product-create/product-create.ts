import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ProductForm } from '../../components/product-form/product-form';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';

import { AlertService } from '../../../../shared/services/alert.service';

import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    ProductForm
  ],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css'
})
export class ProductCreate {


private cdr = inject(ChangeDetectorRef);


  categories: Category[] = [];

  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private router = inject(Router);

  private alert = inject(AlertService);

  ngOnInit(): void {

    this.loadCategories();

  }

loadCategories(): void {

  this.categoryService.getCategories().subscribe({

    next: (categories) => {

      console.log('Categorias recibidas =>', categories);

      this.categories = [...categories];

      this.cdr.detectChanges();

    },

    error: (err) => {

      console.error(err);

    }

  });

}
  createProduct(event: any) {

    const product = event.product;

    const file = event.file;

    this.alert.loading('Subiendo imagen...');

    this.productService.uploadImage(file).subscribe({

      next: (response) => {

        product.imageUrl = response.imageUrl;

        this.alert.loading('Guardando producto...');

        this.productService.create(product).subscribe({

          next: () => {

            this.alert.close();

            this.alert.success(
              'Producto creado',
              'El producto fue registrado correctamente.'
            ).then(() => {

              this.router.navigate(['/products']);

            });

          },

          error: (err) => {

            console.error(err);

            this.alert.close();

            this.alert.error(
              'Error',
              'No fue posible guardar el producto.'
            );

          }

        });

      },

      error: (err) => {

        console.error(err);

        this.alert.close();

        this.alert.error(
          'Error',
          'No fue posible subir la imagen.'
        );

      }

    });

  }

}