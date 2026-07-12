import { Component } from '@angular/core';

@Component({
  selector: 'app-stat-cards',
  imports: [],
  templateUrl: './stat-cards.html',
  styleUrl: './stat-cards.css',
})
export class StatCards {

  cards = [
    {
      title: 'Productos',
      value: 235,
      icon: 'bi-box-seam-fill',
      color: 'blue'
    },
    {
      title: 'Categorías',
      value: 18,
      icon: 'bi-tags-fill',
      color: 'green'
    },
    {
      title: 'Pedidos',
      value: 54,
      icon: 'bi-cart-fill',
      color: 'orange'
    },
    {
      title: 'Clientes',
      value: 120,
      icon: 'bi-people-fill',
      color: 'red'
    }
  ];

}