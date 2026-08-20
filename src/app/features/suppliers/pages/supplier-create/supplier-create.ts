import {
  Component,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import { SupplierForm } from '../../components/supplier-form/supplier-form';

import { SupplierService } from '../../services/supplier.service';

import { AlertService } from '../../../../shared/services/alert.service';


@Component({
  selector: 'app-supplier-create',
  standalone: true,
  imports: [
    SupplierForm
  ],
  templateUrl: './supplier-create.html',
  styleUrl: './supplier-create.css'
})
export class SupplierCreate {


  //=========================================
  // Dependencias
  //=========================================

  private supplierService = inject(SupplierService);

  private router = inject(Router);

  private alert = inject(AlertService);



  //=========================================
  // Crear proveedor
  //=========================================

  createSupplier(data: any): void {


    this.alert.loading(
      'Guardando proveedor...'
    );


    this.supplierService
      .create(data)
      .subscribe({


        next: () => {


          this.alert.close();


          this.alert.success(

            'Proveedor creado',

            'El proveedor fue registrado correctamente.'

          )
          .then(() => {


            this.router.navigate([
              '/suppliers'
            ]);


          });


        },


        error: (err) => {


          console.error(err);


          this.alert.close();


          let message =
            'No fue posible guardar el proveedor.';



          // Error por NIT o Email duplicado

          if (
            err.error?.message?.includes('nit')
          ) {

            message =
              'Ya existe un proveedor con ese NIT.';

          }



          if (
            err.error?.message?.includes('email')
          ) {

            message =
              'Ya existe un proveedor con ese correo electrónico.';

          }



          this.alert.error(

            'Error',

            message

          );


        }


      });


  }


}