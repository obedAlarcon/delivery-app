import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';
import { PurchaseService } from '../../services/purchase.service';
import { SupplierService } from '../../../suppliers/services/supplier.service'; // ajusta ruta
import { ProductService } from '../../../products/services/product.service'; // ajusta ruta

import { Supplier } from '../../../suppliers/models/supplier.model'; // ajusta ruta
import { Product } from '../../../products/models/product.model'; // ajusta ruta
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export interface PurchaseDetailForm {
  productId: number;
  productName: string;
  cost: number;
  quantity: FormControl<number>;
  discount: FormControl<number>;
  taxId: FormControl<number | null>;
  taxPercentage: number;
  subtotal: number;
}

@Component({
  selector: 'app-purchase-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './purchase-create.html',
  styleUrl: './purchase-create.css'
})
export class PurchaseCreate implements OnInit {

  private fb = inject(FormBuilder);
  private purchaseService = inject(PurchaseService);
  private supplierService = inject(SupplierService);
  private productService = inject(ProductService);
  private router = inject(Router);
private cdr = inject(ChangeDetectorRef);
  // Listas
  suppliers: Supplier[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // Detalles de la compra (editables)
  details: PurchaseDetailForm[] = [];

  // Búsqueda catálogo
  searchQuery = '';

  // Impuestos disponibles
  taxes = [
    { id: 1, name: 'IVA 19%', percentage: 19 },
    { id: 2, name: 'IVA 5%', percentage: 5 },
    { id: 3, name: 'Exento', percentage: 0 }
  ];

  // Totales calculados
 

  // Formulario
  form = this.fb.group({
    supplierId: [null, Validators.required],
 
    date: [new Date().toISOString().split('T')[0], Validators.required],
    paymentMethod: ['CASH', Validators.required],
    notes: ['']
  });

  // Proveedor seleccionado (readonly)
  selectedSupplier: Supplier | null = null;

  // Loading
  loadingSuppliers = false;
  loadingProducts = false;
  saving = false;

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();

    // Cuando cambia el proveedor, llenar datos readonly
  this.form.get('supplierId')?.valueChanges.subscribe(id => {
  if (id) {
    this.selectedSupplier = this.suppliers.find(s => s.id === Number(id)) || null;
  } else {
    this.selectedSupplier = null;
  }

 this.cdr.detectChanges();});
  }

onSupplierChange(event: any) {
  const id = Number(event.target.value);
  this.selectedSupplier = this.suppliers.find(s => s.id === id) || null;
}


isAdded(productId: number): boolean {
  return this.details.some(d => d.productId === productId);
}

  loadSuppliers() {
  this.loadingSuppliers = true;
  this.supplierService.getSuppliers().subscribe({
    next: (data) => {
      this.suppliers = data;
      this.loadingSuppliers = false;
    },
    error: () => this.loadingSuppliers = false
  });
}

loadProducts() {
  this.loadingProducts = true;
  this.productService.getProducts().subscribe({
    next: (data) => {
      this.products = data;
      this.filteredProducts = data;
      this.loadingProducts = false;
    },
    error: () => this.loadingProducts = false
  });
}

  // Filtrar catálogo
  onSearch() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(q)
      );
    }
  }

  // Agregar producto del catálogo


addProduct(product: Product) {
  if (this.details.find(d => d.productId === product.id)) return;

  const detail: PurchaseDetailForm = {
    productId: product.id,
    productName: product.name,
    cost: product.price,
    quantity: new FormControl<number>(1, { nonNullable: true }),
    discount: new FormControl<number>(0, { nonNullable: true }),
    taxId: new FormControl<number>(1, { nonNullable: true }),
    taxPercentage: 19,
    subtotal: 0
  };

  detail.quantity.valueChanges.subscribe(() => this.recalcDetail(detail));
  detail.discount.valueChanges.subscribe(() => this.recalcDetail(detail));
  detail.taxId.valueChanges.subscribe(val => {
    const tax = this.taxes.find(t => t.id === Number(val));
    detail.taxPercentage = tax ? tax.percentage : 19;
    this.recalcDetail(detail);
  });

  this.details.push(detail);
  this.recalcDetail(detail);
}





  // Recalcular subtotal de un detalle
  recalcDetail(detail: PurchaseDetailForm) {
    const qty = detail.quantity.value || 0;
    const disc = detail.discount.value || 0;
    const base = detail.cost * qty;
    const afterDiscount = base - (base * disc / 100);
    const taxAmount = afterDiscount * detail.taxPercentage / 100;
    detail.subtotal = afterDiscount + taxAmount;
  }

  // Eliminar producto
  removeDetail(index: number) {
    this.details.splice(index, 1);
  }

  // Formatear dinero
  money(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  get subtotal(): number {
  return this.details.reduce((sum, d) => {
    return sum + (d.cost * (d.quantity.value || 0));
  }, 0);
}

get totalDiscount(): number {
  return this.details.reduce((sum, d) => {
    const base = d.cost * (d.quantity.value || 0);
    return sum + (base * (d.discount.value || 0) / 100);
  }, 0);
}

get totalTaxes(): number {
  return this.details.reduce((sum, d) => {
    const base = d.cost * (d.quantity.value || 0);
    const afterDiscount = base - (base * (d.discount.value || 0) / 100);
    return sum + (afterDiscount * d.taxPercentage / 100);
  }, 0);
}

get total(): number {
  return this.subtotal - this.totalDiscount + this.totalTaxes;
}



  // Guardar
 save() {
  // Validar formulario
  if (this.form.invalid) {
    const missing: string[] = [];
    const fieldNames: any = {
      supplierId: 'Proveedor',
      date: 'Fecha',
      paymentMethod: 'Método de pago'
    };

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) {
        missing.push(fieldNames[key] || key);
      }
    });

    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: `Completa: ${missing.join(', ')}`,
      confirmButtonColor: '#111827',
      confirmButtonText: 'Entendido',
      heightAuto: false
    });
    return;
  }

  // Validar productos
  if (this.details.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin productos',
      text: 'Agrega al menos un producto al catálogo.',
      confirmButtonColor: '#111827',
      confirmButtonText: 'Entendido',
      heightAuto: false
    });
    return;
  }

  // Confirmar
 // Confirmar
Swal.fire({
  title: '¿Guardar compra?',
  text: `Se registrará la compra con ${this.details.length} producto(s).`,
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#111827',
  cancelButtonColor: '#9ca3af',
  confirmButtonText: 'Sí, guardar',
  cancelButtonText: 'Cancelar',
  heightAuto: false
}).then((result) => {
  if (result.isConfirmed) {
    this.saving = true;

    const purchase: any = {
      supplierId: this.form.value.supplierId,
      userId: 1,
      paymentMethod: this.form.value.paymentMethod,
      notes: this.form.value.notes,
      total: this.total,
      details: this.details.map(d => {
        const base = d.cost * (d.quantity.value || 0);
        const disc = base * (d.discount.value || 0) / 100;
        const afterDisc = base - disc;
        const taxAmt = afterDisc * d.taxPercentage / 100;
        const total = afterDisc + taxAmt;

        return {
          productId: d.productId,
          quantity: d.quantity.value,
          cost: d.cost,
          discount: d.discount.value,
          subtotal: afterDisc,
          total: total,
          taxId: d.taxId.value,
          taxRate: d.taxPercentage,
          taxAmount: taxAmt
        };
      })
    };

    this.purchaseService.create(purchase).subscribe({
      next: () => {
        this.saving = false;
        Swal.fire({
          icon: 'success',
          title: 'Compra guardada',
          text: 'La factura se registró correctamente.',
          confirmButtonColor: '#111827',
          confirmButtonText: 'Volver a compras',
          heightAuto: false,
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/purchases']);
        });
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'No se pudo registrar la compra. Intenta de nuevo.',
          confirmButtonColor: '#111827',
          confirmButtonText: 'Cerrar',
          heightAuto: false
        });
        console.error('Error guardando compra', err);
      }
    });
  }
});
}
  // Volver
  back() {
    this.router.navigate(['/purchases']);
  }

debugSave() {
  console.log('form.invalid:', this.form.invalid);
  console.log('form.value:', this.form.value);
  console.log('details.length:', this.details.length);
  console.log('saving:', this.saving);

  // Para ver exactamente qué campo falla
  Object.keys(this.form.controls).forEach(key => {
    const control = this.form.get(key);
    console.log(key, control?.invalid, control?.errors);
  });
}
}