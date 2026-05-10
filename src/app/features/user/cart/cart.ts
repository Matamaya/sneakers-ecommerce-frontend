import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { OrdersService } from '../../../core/services/orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './cart.html'
})
export class Cart {
  cartService = inject(CartService);
  ordersService = inject(OrdersService);
  authService = inject(AuthService);
  router = inject(Router);

  cartItems = this.cartService.getCartItems();

  showCheckoutForm = signal<boolean>(false);
  shippingAddress = signal<string>('');
  notes = signal<string>('');
  isSubmitting = signal<boolean>(false);

  totalPrice = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  totalQuantity = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  updateQuantity(item: CartItem, event: Event) {
    const target = event.target as HTMLInputElement;
    let newQuantity = parseInt(target.value, 10);
    
    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
    this.cartService.updateQuantity(item.product_id, item.size, newQuantity);
    
    // Forzar render de input si sobrepasa stock (Angular no detecta si se cambió internamente)
    target.value = this.cartItems().find(i => i.product_id === item.product_id && i.size === item.size)?.quantity.toString() || '1';
  }
  
  removeItem(productId: string, size: string) {
    this.cartService.removeFromCart(productId, size);
  }

  startCheckout() {
    if (!this.authService.isLoggedIn()) {
      alert("Debes iniciar sesión para finalizar el pedido");
      this.router.navigate(['/login']);
      return;
    }
    this.showCheckoutForm.set(true);
  }

  submitOrder() {
    if (!this.shippingAddress().trim()) {
      alert("Por favor, introduce una dirección de envío.");
      return;
    }

    this.isSubmitting.set(true);

    const orderData = {
      items: this.cartItems().map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size
      })),
      shipping_address: this.shippingAddress(),
      notes: this.notes()
    };

    this.ordersService.createOrder(orderData).subscribe({
      next: (res) => {
        this.cartService.clearCart();
        this.isSubmitting.set(false);
        alert("¡Pedido realizado con éxito!");
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        console.error(err);
        alert("Error al procesar el pedido: " + (err.error?.error || err.message));
        this.isSubmitting.set(false);
      }
    });
  }
}
