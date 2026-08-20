import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import Swal from 'sweetalert2';


import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

import { SupplierForm } from '../../components/supplier-form/supplier-form';



@Component({
  selector: 'app-supplier-edit',
  standalone: true,
  imports: [
    SupplierForm
  ],
  templateUrl: './supplier-edit.html',
  styleUrl: './supplier-edit.css'
})
export class SupplierEdit {


  supplier: Supplier | null = null;


  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private supplierService = inject(SupplierService);



  ngOnInit(): void {


    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );



    this.loadSupplier(id);


  }



  loadSupplier(id:number):void{


    this.supplierService.getById(id)
    .subscribe({


      next:(supplier)=>{


        this.supplier = supplier;


      },


      error:(err)=>{


        console.error(err);



        Swal.fire({

          icon:'error',

          title:'Proveedor no encontrado'

        });


        this.router.navigate(['/suppliers']);


      }


    });


  }




  updateSupplier(data:any):void{


    if(!this.supplier) return;



    Swal.fire({

      title:'Actualizando proveedor',

      text:'Por favor espere...',

      allowOutsideClick:false,

      didOpen:()=>{

        Swal.showLoading();

      }

    });



    this.supplierService
    .update(this.supplier.id,data)
    .subscribe({



      next:()=>{


        Swal.fire({

          icon:'success',

          title:'Proveedor actualizado',

          text:'Los cambios fueron guardados correctamente.',

          timer:1800,

          showConfirmButton:false


        }).then(()=>{


          this.router.navigate(['/suppliers']);


        });


      },



      error:(error)=>{


        console.error(error);


        Swal.close();



        let message =
        'No fue posible actualizar el proveedor';



        if(error.error?.message?.includes('nit')){


          message =
          'El NIT ya pertenece a otro proveedor';


        }



        if(error.error?.message?.includes('email')){


          message =
          'El correo ya pertenece a otro proveedor';


        }



        Swal.fire({

          icon:'error',

          title:'Error',

          text:message

        });



      }



    });


  }


}