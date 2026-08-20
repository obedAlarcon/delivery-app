import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './supplier-filters.html',
  styleUrl: './supplier-filters.css'
})
export class SupplierFilters {

  @Output()
  searchChange = new EventEmitter<string>();

  @Output()
  statusChange = new EventEmitter<boolean | null>();

  @Output()
  clear = new EventEmitter<void>();

  search = '';

  status: boolean | null = null;

  onSearch(): void {

    this.searchChange.emit(this.search);

  }

  onStatus(): void {

    this.statusChange.emit(this.status);

  }

  clearFilters(): void {

    this.search = '';

    this.status = null;

    this.clear.emit();

  }

}