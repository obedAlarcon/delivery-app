import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Supplier } from '../../../suppliers/models/supplier.model';
import { SupplierService } from '../../../suppliers/services/supplier.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class Suppliers implements OnInit {

  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];

  totalSuppliers = 0;
  activeSuppliers = 0;
  inactiveSuppliers = 0;

  searchTerm = '';
  selectedStatus = '';

  loading = false;
  error = '';

  constructor(
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {

    this.loading = true;
    this.error = '';

    this.supplierService.getSuppliers().subscribe({

      next: (suppliers) => {

        console.log('PROVEEDORES RECIBIDOS:', suppliers);

        this.suppliers = suppliers;

        this.calculateStatistics();

        this.filteredSuppliers = [...this.suppliers];

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'ERROR CARGANDO PROVEEDORES:',
          error
        );

        this.error =
          'No fue posible cargar los proveedores';

        this.loading = false;

      }

    });

  }

  calculateStatistics(): void {

    this.totalSuppliers =
      this.suppliers.length;

    this.activeSuppliers =
      this.suppliers.filter(
        supplier => supplier.isActive === true
      ).length;

    this.inactiveSuppliers =
      this.suppliers.filter(
        supplier => supplier.isActive === false
      ).length;

  }

  applyFilters(): void {

    const search =
      String(this.searchTerm || '')
        .trim()
        .toLowerCase();

    this.filteredSuppliers =
      this.suppliers.filter(supplier => {

        const name =
          String(supplier.name || '')
            .trim()
            .toLowerCase();

        const company =
          String(supplier.company || '')
            .trim()
            .toLowerCase();

        const nit =
          String(supplier.nit || '')
            .trim()
            .toLowerCase();

        const email =
          String(supplier.email || '')
            .trim()
            .toLowerCase();

        const phone =
          String(supplier.phone || '')
            .trim()
            .toLowerCase();

        const matchesSearch =
          search === '' ||
          name.includes(search) ||
          company.includes(search) ||
          nit.includes(search) ||
          email.includes(search) ||
          phone.includes(search);

        const matchesStatus =
          this.selectedStatus === '' ||
          this.getSupplierStatus(supplier)
            === this.selectedStatus;

        return (
          matchesSearch &&
          matchesStatus
        );

      });

  }

  clearFilters(): void {

    this.searchTerm = '';
    this.selectedStatus = '';

    this.filteredSuppliers =
      [...this.suppliers];

  }

  getSupplierStatus(
    supplier: Supplier
  ): string {

    return supplier.isActive
      ? 'Activo'
      : 'Inactivo';

  }

  getStatusClass(
    supplier: Supplier
  ): string {

    return supplier.isActive
      ? 'bg-success'
      : 'bg-danger';

  }



exportExcel(): void {

  console.log('CLICK EN EXCEL');

  const data = this.suppliers.map(supplier => ({
    ID: supplier.id,
    Nombre: supplier.name,
    Empresa: supplier.company,
    NIT: supplier.nit,
    Email: supplier.email,
    Teléfono: supplier.phone,
    Dirección: supplier.address,
    'Persona de contacto': supplier.contactPerson || '',
    Observaciones: supplier.observations || '',
    Estado: supplier.isActive ? 'Activo' : 'Inactivo',
    'Fecha creación': supplier.createdAt
  }));

  console.log('DATOS EXCEL:', data);

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Proveedores'
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  console.log('BUFFER GENERADO:', excelBuffer);

  const blob = new Blob(
    [excelBuffer],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  );

  console.log('BLOB GENERADO:', blob);

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = 'proveedores.xlsx';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

  console.log('EXCEL DESCARGADO');
}
  



exportPDF(): void {
  const doc = new jsPDF('landscape');

  doc.setFontSize(18);
  doc.text('Listado de Proveedores', 14, 20);

  autoTable(doc, {
    startY: 30,

    head: [[
      'ID',
      'Nombre',
      'Empresa',
      'NIT',
      'Email',
      'Teléfono',
      'Dirección',
      'Contacto',
      'Estado'
    ]],

    body: this.suppliers.map(supplier => [
      supplier.id,
      supplier.name,
      supplier.company,
      supplier.nit,
      supplier.email,
      supplier.phone,
      supplier.address,
      supplier.contactPerson || '',
      supplier.isActive ? 'Activo' : 'Inactivo'
    ]),

    styles: {
      fontSize: 7,
      cellPadding: 2
    },

    headStyles: {
      fillColor: [61, 69, 55],
      textColor: 255
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  doc.save('proveedores.pdf');
}



}