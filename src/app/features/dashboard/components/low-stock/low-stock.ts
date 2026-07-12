import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './low-stock.html',
  styleUrl: './low-stock.css',
})
export class LowStock {

  products = [
    { name: 'Coca Cola 350ml', stock: 3 },
    { name: 'Leche Entera', stock: 5 },
    { name: 'Arroz Diana', stock: 2 },
    { name: 'Huevos AA', stock: 1 },
    { name: 'Aceite Premier', stock: 4 }
  ];

}