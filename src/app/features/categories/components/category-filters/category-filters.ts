import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './category-filters.html',
  styleUrl: './category-filters.css'
})
export class CategoryFilters {

  @Output()
  searchChange = new EventEmitter<string>();

  @Output()
  clear = new EventEmitter<void>();

  search = '';

  onSearch(): void {

    this.searchChange.emit(this.search);

  }

  clearFilters(): void {

    this.search = '';

    this.clear.emit();

  }

}