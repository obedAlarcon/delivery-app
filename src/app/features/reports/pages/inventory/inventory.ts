import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../products/models/product.model';
import { ProductService } from '../../../products/services/product.service';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {
   
  products: Product[] = [];
  filteredProducts: Product[] = [];

  totalProducts = 0;
  totalStock = 0;
  lowStock = 0;
  outOfStock = 0;
  inventoryValue = 0;

  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  categories: string[] = [];

  loading = false;
  error = '';

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {

    this.loading = true;
    this.error = '';

    this.productService.getProducts().subscribe({

      next: (products) => {

        console.log('PRODUCTOS INVENTARIO:', products);

        this.products = products;

        this.categories = [
          ...new Set(
            products.map(product =>
              product.category?.name || 'Sin categoría'
            )
          )
        ];

        this.calculateInventory();

        this.filteredProducts = [...this.products];

        this.loading = false;

      },

      error: (error) => {

        console.error('ERROR CARGANDO INVENTARIO:', error);

        this.error = 'No fue posible cargar el inventario';

        this.loading = false;

      }

    });

  }

  calculateInventory(): void {

    this.totalProducts = this.products.length;

    this.totalStock = this.products.reduce(
      (total, product) =>
        total + Number(product.stock || 0),
      0
    );

    this.lowStock = this.products.filter(
      product =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 5
    ).length;

    this.outOfStock = this.products.filter(
      product =>
        Number(product.stock || 0) === 0
    ).length;

    this.inventoryValue = this.products.reduce(
      (total, product) =>
        total +
        (
          Number(product.price || 0) *
          Number(product.stock || 0)
        ),
      0
    );

  }

 
applyFilters(): void {

  const search = String(this.searchTerm || '')
    .trim()
    .toLowerCase();

  this.filteredProducts = this.products.filter(product => {

    const productName = String(product.name || '')
      .trim()
      .toLowerCase();

    const category = String(
      product.category?.name || 'Sin categoría'
    );

    const stock = Number(product.stock || 0);

    const status = this.getStockStatus(stock);

    const matchesSearch =
      search === '' ||
      productName.includes(search);

    const matchesCategory =
      this.selectedCategory === '' ||
      category === this.selectedCategory;

    const matchesStatus =
      this.selectedStatus === '' ||
      status === this.selectedStatus;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );

  });

  console.log('FILTRO PRODUCTO:', search);
  console.log(
    'RESULTADOS:',
    this.filteredProducts.length
  );

}







  clearFilters(): void {

    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';

    this.filteredProducts = [...this.products];

  }

  

  getStockClass(stock: number): string {

    if (stock === 0) {
      return 'bg-danger';
    }

    if (stock <= 5) {
      return 'bg-warning text-dark';
    }

    return 'bg-success';

  }














  // ============================
  // EXPORTAR EXCEL
  // ============================
 // ============================
// EXPORTAR EXCEL
// ============================
exportExcel(): void {

  const data = this.filteredProducts.map(product => ({
    'Producto': product.name || '',
    'Categoría': product.category?.name || 'Sin categoría',
    'Stock': Number(product.stock || 0),
    'Precio': Number(product.price || 0),
    'Valor inventario':
      Number(product.price || 0) * Number(product.stock || 0),
    'Estado': this.getStockStatus(Number(product.stock || 0))
  }));

  const worksheet: XLSX.WorkSheet =
    XLSX.utils.json_to_sheet(data);

  const workbook: XLSX.WorkBook = {
    Sheets: {
      'Inventario': worksheet
    },
    SheetNames: ['Inventario']
  };

  XLSX.writeFile(workbook, 'inventario.xlsx');
}


// ============================
// EXPORTAR PDF
// ============================
exportPdf(): void {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Reporte de Inventario', 14, 20);

  doc.setFontSize(10);

  const fecha = new Date().toLocaleDateString('es-CO');

  doc.text(`Fecha: ${fecha}`, 14, 28);

  doc.text(
    `Productos: ${this.filteredProducts.length}`,
    14,
    34
  );

  const rows = this.filteredProducts.map(product => {

    const stock = Number(product.stock || 0);
    const price = Number(product.price || 0);
    const value = price * stock;

    return [
      product.name || '',
      product.category?.name || 'Sin categoría',
      stock.toString(),
      this.formatCurrency(price),
      this.formatCurrency(value),
      this.getStockStatus(stock)
    ];

  });

  autoTable(doc, {

    startY: 40,

    head: [[
      'Producto',
      'Categoría',
      'Stock',
      'Precio',
      'Valor inventario',
      'Estado'
    ]],

    body: rows,

    theme: 'grid',

    styles: {
      fontSize: 8
    },

    headStyles: {
      fontStyle: 'bold'
    }

  });

  doc.save('inventario.pdf');
}
formatCurrency(value: number): string {

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}
getStockStatus(stock: number): string {

  if (stock <= 0) {
    return 'Agotado';
  }

  if (stock <= 5) {
    return 'Stock bajo';
  }

  return 'Disponible';
}
}