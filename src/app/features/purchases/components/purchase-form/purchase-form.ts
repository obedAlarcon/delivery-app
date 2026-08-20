import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';


import { SupplierService } from '../../../suppliers/services/supplier.service';
import { Supplier } from '../../../suppliers/models/supplier.model';


import { ProductService } from '../../../products/services/product.service';
import { Product } from '../../../products/models/product.model';


import { PurchaseDetail } from '../purchase-detail/purchase-detail';
import { TaxService } from '../../../taxes/services/tax.service';
import { Tax } from '../../../taxes/models/tax.model';
import { PurchaseService } from '../../services/purchase.service';


@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PurchaseDetail
  ],
  templateUrl: './purchase-form.html',
  styleUrl: './purchase-form.css'
})
export class PurchaseForm implements OnInit {


  private fb = inject(FormBuilder);


  private supplierService = inject(SupplierService);
  private purchaseService = inject(PurchaseService);

  private productService = inject(ProductService);
  private taxService=inject(TaxService);


  suppliers: Supplier[] = [];


  products: Product[] = [];


  filteredProducts: Product[] = [];





  form: FormGroup = this.fb.group({


    supplierId:[

      null,

      Validators.required

    ],



    company:[

      ''

    ],



    nit:[

      ''

    ],






    purchaseDate:[

      new Date()

    ],



    paymentMethod:[

      'CASH',

      Validators.required

    ],



    notes:[

      ''

    ],



    details:this.fb.array([])


  });
taxes: Tax []=[]







  get details(): FormArray {


    return this.form.get('details') as FormArray;


  }






ngOnInit(): void {

  this.loadSuppliers();

  this.loadProducts();

  this.loadTaxes();


  this.form.get('supplierId')
  ?.valueChanges
  .subscribe(id=>{


    if(!id){
      return;
    }


    const supplier =
    this.suppliers.find(
      supplier =>
      Number(supplier.id) === Number(id)
    );


    if(!supplier){

      console.log(
        'Proveedor no encontrado todavía',
        id
      );

      return;

    }

console.log(
 'SUPPLIER AL GUARDAR:',
 this.form.get('supplierId')?.value
);
    this.form.patchValue({

      company: supplier.company,

      nit: supplier.nit

    });


  });

}


loadSuppliers(){

  this.supplierService
  .getSuppliers()
  .subscribe({

    next:(data)=>{

      this.suppliers = data;

      console.log('PROVEEDORES CARGADOS', this.suppliers);

    },


    error:(err)=>{

      console.error(err);

    }

  });

}


loadTaxes(): void {

  this.taxService.getTaxes().subscribe({

    next: (data) => {

      console.log('IMPUESTOS', data);

      this.taxes = data;

    },

    error: console.error

  });

}


  loadProducts(){


    this.productService
    .getProducts()
    .subscribe(products=>{


      this.products = products;


      this.filteredProducts = [
        ...products
      ];


    });


  }







  filterProducts(event:Event){


    const value =
    (event.target as HTMLInputElement)
    .value
    .toLowerCase()
    .trim();



    if(!value){


      this.filteredProducts =
      [
        ...this.products
      ];


      return;


    }



    this.filteredProducts =
    this.products.filter(product=>

      product.name
      .toLowerCase()
      .includes(value)

    );


  }


addProduct(product: Product): void {

  const exists = this.details.controls.find(control =>
    control.get('productId')?.value === product.id
  );

  if (exists) {
    return;
  }

  const detail = this.fb.group({

    productId: [product.id],

    name: [product.name],

    description: [product.description],

    quantity: [1, Validators.required],

    cost: [product.price, Validators.required],

    discount: [0],

    taxId: [null],

    taxRate: [0],

    subtotal: [0],

    taxAmount: [0],

    total: [0]

  });

  detail.valueChanges.subscribe(() => {

    this.calculateDetail(detail);

  });

  this.calculateDetail(detail);

  this.details.push(detail);

}






  removeProduct(index:number){


    this.details.removeAt(index);


  }

save(): void {

  console.log('PASO 1 SAVE');


  const value = this.form.value;


  console.log('PASO 2 FORM', value);




  if (!value.supplierId) {

    console.log('FALTA PROVEEDOR');

    return;

  }



  if (!value.details || value.details.length === 0) {

    console.log('FALTAN PRODUCTOS');

    return;

  }

const purchase = {

  supplierId: value.supplierId,

  userId: 1,

  paymentMethod: value.paymentMethod,

 

  notes: value.notes,

  total: this.details.controls.reduce(
    (sum, item) =>
      sum + Number(item.get('total')?.value || 0),
    0
  ),

  details: value.details.map((detail:any)=>({

    productId: detail.productId,

    quantity: detail.quantity,

    cost: detail.cost,

    subtotal: detail.subtotal,

    total: detail.total,

    taxId: detail.taxId,

    taxRate: detail.taxRate,

    taxAmount: detail.taxAmount

  }))

};




  console.log('PASO 3 JSON', purchase);




  this.purchaseService.create(purchase)

  .subscribe({


    next:(response)=>{


      console.log(
        'PASO 4 RESPUESTA',
        response
      );


      alert('Compra guardada correctamente');


    },



    error:(error)=>{


      console.error(
        'PASO ERROR',
        error
      );


    }


  });


}


calculateDetail(detail: FormGroup): void {

  const quantity = Number(detail.get('quantity')?.value ?? 0);

  const cost = Number(detail.get('cost')?.value ?? 0);

  const discountPercent = Number(detail.get('discount')?.value ?? 0);

  const taxId = Number(detail.get('taxId')?.value ?? 0);


  const tax = this.taxes.find(t => t.id === taxId);

  const taxRate = tax?.percentage ?? 0;


  // Subtotal bruto
  const subtotal = quantity * cost;


  // Descuento solo afecta subtotal
  const discountAmount = subtotal * (discountPercent / 100);


  // Impuesto fijo sobre subtotal original
  const taxAmount = subtotal * (taxRate / 100);


  // Total final
  const total = subtotal - discountAmount + taxAmount;


  detail.patchValue(
    {
      taxRate,
      subtotal,
      discountAmount,
      taxAmount,
      total
    },
    {
      emitEvent: false
    }
  );

}

}