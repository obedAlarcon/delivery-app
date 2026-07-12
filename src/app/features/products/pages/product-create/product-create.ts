import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ProductForm } from '../../components/product-form/product-form';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [ProductForm],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css'
})
export class ProductCreate {

  private productService = inject(ProductService);
  private router = inject(Router);
  private alert = inject(AlertService);

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