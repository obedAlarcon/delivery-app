import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-filters.html',
  styleUrl: './user-filters.css',
})
export class UserFilters {

  search = '';
  role = '';
  status = '';

  @Output() searchChange = new EventEmitter<string>();
  @Output() roleChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  onSearch(): void {
    this.searchChange.emit(this.search);
  }

  onRole(): void {
    this.roleChange.emit(this.role);
  }

  onStatus(): void {
    this.statusChange.emit(this.status);
  }

  clearFilters(): void {
    this.search = '';
    this.role = '';
    this.status = '';

    this.clear.emit();
  }

}