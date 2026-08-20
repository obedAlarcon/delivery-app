import { Component, inject, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';
import { Footer } from './components/footer/footer';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Sidebar,
    Footer,
    Breadcrumb
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {
protected sidebarService = inject(SidebarService);
}