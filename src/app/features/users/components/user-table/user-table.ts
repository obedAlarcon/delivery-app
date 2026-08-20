import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css',
})
export class UserTable {
@Input() users: User[] = [];
@Output() editUser = new EventEmitter<number>();

@Output() deleteUser = new EventEmitter<number>();


onEdit(id: number): void {
  this.editUser.emit(id);
}

onDelete(id: number): void {
  this.deleteUser.emit(id);
}

}