import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.css'
})
export class CustomerCard implements OnInit{

  //==========================================
  // Dependencias
  //==========================================

  private customerService = inject(CustomerService);

  //==========================================
  // Variables
  //==========================================

  customers: Customer[] = [];

  filteredCustomers: Customer[] = [];

  selectedCustomer: Customer | null = null;

  searchCustomer = '';

  loading = false;

  //==========================================
  // Inicio
  //==========================================

  ngOnInit(): void {

    this.loadCustomers();

  }

  //==========================================
  // Cargar clientes
  //==========================================

  loadCustomers(): void {

    this.loading = true;

    this.customerService.getCustomers().subscribe({

      next: (customers) => {
  console.log('Clientes recibidos:', customers);
  console.log(customers);
        this.customers = customers;

        this.filteredCustomers = [...customers];

        this.loading = false;

      },

      error: (error) => {

        console.error(error);

        this.loading = false;

      }

    });

  }

  //==========================================
  // Buscar
  //==========================================

  filterCustomers(): void {

  const value = this.searchCustomer.toLowerCase().trim();

  if (!value) {

    this.filteredCustomers = [...this.customers];

    return;

  }

  this.filteredCustomers = this.customers.filter(customer =>

    customer.name.toLowerCase().includes(value) ||

    customer.phone.includes(value)

  );

}
  //==========================================
  // Seleccionar
  //==========================================

 selectCustomer(customer: Customer): void {

  this.selectedCustomer = customer;

  this.searchCustomer = customer.name;

  this.filteredCustomers = [];


}

  //==========================================
  // Limpiar
  //==========================================

  clearCustomer(): void {

    this.selectedCustomer = null;

    this.searchCustomer = '';

    this.filteredCustomers = [...this.customers];

  }

}