import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart.service';
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
  cartService = inject(CartService);
  
  // Estado dinámico desde el servicio
  cartItemCount = computed(() => this.cartService.totalItems); 

  logout(): void {
    this.authService.logout();
  }
}