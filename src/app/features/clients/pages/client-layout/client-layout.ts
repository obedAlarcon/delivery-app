import { Component, inject, NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClientHeader } from '../../components/client-header/client-header';

@Component({
  selector: 'app-client-layout',
  standalone:true,
  imports: [RouterLink,
 
    RouterOutlet,
    RouterLinkActive,
    ClientHeader
  ],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.css',
})
export class ClientLayout {


}
