import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.css'
})
export class ProductFilters {

  @Input()
  categories: Category[] = [];

  @Output()
  searchChange = new EventEmitter<string>();

  @Output()
  categoryChange = new EventEmitter<number>();

  @Output()
  statusChange = new EventEmitter<boolean | null>();

  @Output()
  clear = new EventEmitter<void>();

  search = '';

  categoryId = 0;

  status: boolean | null = null;

  onSearch(): void {

    this.searchChange.emit(this.search);

  }

  onCategory(): void {

    this.categoryChange.emit(this.categoryId);

  }

  onStatus(): void {

    this.statusChange.emit(this.status);

  }

  clearFilters(): void {

    this.search = '';

    this.categoryId = 0;

    this.status = null;

    this.clear.emit();

  }

}