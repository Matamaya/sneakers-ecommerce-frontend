import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  // Servicios
  authService = inject(AuthService);
  
  // Estado local (Más adelante vendrá del CartService)
  cartItemCount = signal<number>(0); 

  logout(): void {
    this.authService.logout();
  }
}