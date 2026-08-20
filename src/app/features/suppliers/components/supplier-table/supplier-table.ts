import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './supplier-table.html',
  styleUrl: './supplier-table.css'
})
export class SupplierTable {

  @Input() suppliers: Supplier[] = [];

  @Output() view = new EventEmitter<Supplier>();

  @Output() edit = new EventEmitter<number>();

  @Output() delete = new EventEmitter<Supplier>();

  onView(supplier: Supplier): void {
    this.view.emit(supplier);
  }

  onEdit(id: number): void {
    this.edit.emit(id);
  }

  onDelete(supplier: Supplier): void {
    this.delete.emit(supplier);
  }

}