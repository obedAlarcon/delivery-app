import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { Customer } from '../../../customers/models/customer.model';
import { CustomerService } from '../../../customers/services/customer.service';

@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.css'
})
export class CustomerCard implements OnInit {

  @Output()
  customerSelected = new EventEmitter<Customer>();

  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: any = null;

  searchCustomer = '';

  selectedCustomer: Customer | null = null;

  customers: Customer[] = [];

  filteredCustomers: Customer[] = [];

  showCustomerList = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.customerService.getCustomers().subscribe({

      next: (customers) => {

        this.customers = customers;
        this.filteredCustomers = [...customers];

      },

      error: (err) => console.error(err)

    });

  }

  filterCustomers(): void {

    if (this.searchCustomer.trim().length > 0) {

      const search = this.searchCustomer.toLowerCase();

      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(search)
      );

      this.showCustomerList = true;

    } else {

      this.filteredCustomers = [];
      this.showCustomerList = false;

    }

  }

  selectCustomer(customer: Customer): void {

    this.selectedCustomer = customer;

    this.searchCustomer = customer.name;

    this.filteredCustomers = [];

    this.showCustomerList = false;

    this.customerSelected.emit(customer);

  }

  clearCustomer(): void {

    this.selectedCustomer = null;

    this.searchCustomer = '';

    this.filteredCustomers = [...this.customers];

    this.showCustomerList = false;

  }

  createCustomer(): void {

    this.router.navigate(['/customers/create']);

  }

}