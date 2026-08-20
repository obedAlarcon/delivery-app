import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';

import { ProductService } from '../../../products/services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { OrderService } from '../../../orders/services/order.service';
import { CustomerService } from '../../../customers/services/customer.service';

@Component({
  selector: 'app-stat-cards',
  imports: [],
  templateUrl: './stat-cards.html',
  styleUrl: './stat-cards.css',
})
export class StatCards implements OnInit {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);
private cdr = inject(ChangeDetectorRef);
  cards = [
    {
      title: 'Productos',
      value: 0,
      icon: 'bi-box-seam-fill',
      color: 'blue'
    },
    {
      title: 'Categorías',
      value: 0,
      icon: 'bi-tags-fill',
      color: 'green'
    },
    {
      title: 'Pedidos',
      value: 0,
      icon: 'bi-cart-fill',
      color: 'orange'
    },
    {
      title: 'Clientes',
      value: 0,
      icon: 'bi-people-fill',
      color: 'red'
    }
  ];

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts(),
      categories: this.categoryService.getCategories(),
      orders: this.orderService.getOrders(),
      customers: this.customerService.getCustomers()
    }).subscribe({
      next: ({ products, categories, orders, customers }) => {
        this.cards[0].value = products.length;
        this.cards[1].value = categories.length;
        this.cards[2].value = orders.length;
        this.cards[3].value = customers.length;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error)
    });
  }
 
}