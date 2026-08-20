import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.css',
})
export class CategoryFilter {

  @Input() categories: any[] = [];

  @Input() selectedCategory: number | null = null;

  @Output() categoryChange = new EventEmitter<number | null>();

  selectCategory(categoryId: number | null): void {
    this.categoryChange.emit(categoryId);
  }
}