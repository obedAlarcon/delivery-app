import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer } from '../../../customers/models/customer.model';
import { CustomerService } from '../../../customers/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  totalCustomers = 0;
  activeCustomers = 0;
  inactiveCustomers = 0;

  searchTerm = '';
  selectedStatus = '';

  loading = false;
  error = '';

  constructor(
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.loading = true;
    this.error = '';

    this.customerService.getCustomers().subscribe({

      next: (customers) => {

        console.log('CLIENTES RECIBIDOS:', customers);

        this.customers = customers;

        this.calculateStatistics();

        this.filteredCustomers = [...this.customers];

        this.loading = false;

      },

      error: (error) => {

        console.error('ERROR CARGANDO CLIENTES:', error);

        this.error = 'No fue posible cargar los clientes';

        this.loading = false;

      }

    });

  }

  calculateStatistics(): void {

    this.totalCustomers = this.customers.length;

    this.activeCustomers = this.customers.filter(
      customer => customer.isActive !== false
    ).length;

    this.inactiveCustomers = this.customers.filter(
      customer => customer.isActive === false
    ).length;

  }

  applyFilters(): void {

    const search = String(this.searchTerm || '')
      .trim()
      .toLowerCase();

    this.filteredCustomers = this.customers.filter(customer => {

      const name = String(customer.name || '')
        .trim()
        .toLowerCase();

      const email = String(customer.email || '')
        .trim()
        .toLowerCase();

      const phone = String(customer.phone || '')
        .trim()
        .toLowerCase();

      const matchesSearch =
        search === '' ||
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search);

      const matchesStatus =
        this.selectedStatus === '' ||
        this.getCustomerStatus(customer) === this.selectedStatus;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }

  clearFilters(): void {

    this.searchTerm = '';
    this.selectedStatus = '';

    this.filteredCustomers = [...this.customers];

  }

  getCustomerStatus(customer: Customer): string {

    return customer.isActive === false
      ? 'Inactivo'
      : 'Activo';

  }

  getStatusClass(customer: Customer): string {

    return customer.isActive === false
      ? 'bg-danger'
      : 'bg-success';

  }





  exportExcel(): void {
  const data = this.customers.map(customer => ({
    ID: customer.id,
    Nombre: customer.name,
    Email: customer.email,
    Teléfono: customer.phone
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

  XLSX.writeFile(workbook, 'clientes.xlsx');
}



exportPDF(): void {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Listado de Clientes', 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['ID', 'Nombre', 'Email', 'Teléfono']],
    body: this.customers.map(customer => [
      customer.id,
      customer.name,
      customer.email,
      customer.phone
    ])
  });

  doc.save('clientes.pdf');
}




}