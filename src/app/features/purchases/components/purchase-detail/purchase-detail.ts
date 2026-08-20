import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  FormArray,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { Supplier } from '../../../suppliers/models/supplier.model';
import { Tax } from '../../../taxes/models/tax.model';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './purchase-detail.html',
  styleUrl: './purchase-detail.css'
})
export class PurchaseDetail implements OnChanges {  // <-- OnChanges, NO OnInit

  @Input({ required: true })
  form!: FormGroup;

  @Input({ required: true })
  details!: FormArray;

  @Input()
  suppliers: Supplier[] = [];

  @Input()
  taxes: Tax[] = [];

  @Output()
  remove = new EventEmitter<number>();

  @Output() savePurchase = new EventEmitter<void>();

  @Input()
  readOnly = false;

  // Trackea cuáles controles ya tienen suscripción
  private subscribedControls = new Set<number>();

  constructor(private cdr: ChangeDetectorRef) {}  // <-- ahora sí lo usas

  // Se ejecuta CADA VEZ que un @Input cambia
  ngOnChanges(changes: SimpleChanges): void {
    
    // Reaccionar cuando el FormArray cambie
    if (changes['details']) {
      this.setupDetailListeners();
    }

    // Reaccionar cuando cambien los taxes (necesario para recalcular)
    if (changes['taxes'] && this.taxes.length > 0) {
      this.recalculateAll();
    }
  }

  private setupDetailListeners(): void {
    
    this.details.controls.forEach((control, index) => {
      
      // Solo suscribirse si NO estaba suscrito antes
      if (!this.subscribedControls.has(index)) {
        this.subscribedControls.add(index);
        
        // Calcular valor inicial
        this.calculate(control as FormGroup);

        // Suscribirse a cambios futuros
        (control as FormGroup).valueChanges.subscribe(() => {
          this.calculate(control as FormGroup);
        });
      }
    });

    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  private recalculateAll(): void {
    this.details.controls.forEach(control => {
      this.calculate(control as FormGroup);
    });
    this.cdr.detectChanges();
  }

  removeProduct(index: number): void {
    this.subscribedControls.delete(index);
    // Reindexar el Set después de eliminar
    const newSet = new Set<number>();
    this.subscribedControls.forEach(i => {
      if (i < index) newSet.add(i);
      if (i > index) newSet.add(i - 1);
    });
    this.subscribedControls = newSet;
    
    this.remove.emit(index);
  }

  calculate(group: FormGroup): void {
    const quantity = Number(group.get('quantity')?.value || 0);
    const cost = Number(group.get('cost')?.value || 0);
    const discountPercent = Number(group.get('discount')?.value || 0);
    const taxId = Number(group.get('taxId')?.value || 0);

    const tax = this.taxes.find(x => x.id === taxId);
    const taxPercent = tax?.percentage ?? 0;

    const subtotal = quantity * cost;
    const discountAmount = subtotal * (discountPercent / 100);
    const taxable = subtotal - discountAmount;
    const taxAmount = taxable * (taxPercent / 100);
    const total = taxable + taxAmount;

    group.patchValue({
      taxRate: taxPercent,
      subtotal,
      taxAmount,
      total
    }, { emitEvent: false });
  }

  get subtotal(): number {
    return this.details.controls.reduce((sum, control) => {
      return sum + Number(control.get('subtotal')?.value || 0);
    }, 0);
  }

  get totalDiscount(): number {
    return this.details.controls.reduce((sum, control) => {
      const subtotal = Number(control.get('subtotal')?.value || 0);
      const percent = Number(control.get('discount')?.value || 0);
      return sum + (subtotal * percent / 100);
    }, 0);
  }

  get totalTax(): number {
    return this.details.controls.reduce((sum, control) => {
      return sum + Number(control.get('taxAmount')?.value || 0);
    }, 0);
  }

  get total(): number {
    return this.details.controls.reduce((sum, control) => {
      return sum + Number(control.get('total')?.value || 0);
    }, 0);
  }

  save() {
    console.log('BOTON GUARDAR DESDE DETAIL');
    this.savePurchase.emit();
  }
}