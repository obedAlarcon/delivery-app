import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';



import { CustomerService } from '../../../customers/services/customer.service';
import { Customer } from '../../../customers/models/customer.model';
import { AuthService } from '../../../auth/services/auth.service';

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
  searchCustomer = '';

  selectedCustomer: Customer | null = null;

  customers: Customer[] = [];

  filteredCustomers: Customer[] = [];
currentUser: any = null;
  router: any;
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
showCustomerList = false;
// Asegúrate que showCustomerList se ponga en true
filterCustomers() {
    console.log('searchCustomer:', this.searchCustomer);
    console.log('customers:', this.customers);
    
    if (this.searchCustomer && this.searchCustomer.length > 0) {
        this.filteredCustomers = this.customers.filter(c => 
            c.name.toLowerCase().includes(this.searchCustomer.toLowerCase())
        );
        console.log('filteredCustomers:', this.filteredCustomers);
        this.showCustomerList = true;
        console.log('showCustomerList:', this.showCustomerList);
    } else {
        this.showCustomerList = false;
    }
}
 selectCustomer(customer: Customer) {

  this.selectedCustomer = customer;
  this.searchCustomer = customer.name;

  this.filteredCustomers = [];
  this.showCustomerList = false;
 this.customerSelected.emit(customer);
}
createCustomer() {
  this.router.navigate(['/customers/create']);
}
  clearCustomer(): void {

    this.selectedCustomer = null;

    this.searchCustomer = '';

    this.filteredCustomers = [...this.customers];

  }

}