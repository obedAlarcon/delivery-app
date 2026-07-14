import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './category-table.html',
  styleUrl: './category-table.css'
})
export class CategoryTable {

  @Input()
  categories: Category[] = [];

  @Output()
  deleteCategory = new EventEmitter<number>();

  delete(id: number): void {
    this.deleteCategory.emit(id);
  }

}