import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './customer-table.html',
  styleUrl: './customer-table.css'
})
export class CustomerTable {

  @Input() customers: Customer[] = [];

  @Output() view = new EventEmitter<Customer>();

  @Output() edit = new EventEmitter<number>();

  @Output() delete = new EventEmitter<Customer>();

  onView(customer: Customer): void {

    this.view.emit(customer);

  }

  onEdit(id: number): void {

    this.edit.emit(id);

  }

  onDelete(customer: Customer): void {

    this.delete.emit(customer);

  }

}