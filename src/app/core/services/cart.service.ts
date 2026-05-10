import { Injectable, signal } from '@angular/core';

export interface CartItem {
  product_id: string;
  name: string;
  brand: string;
  price: number;
  size: string;
  quantity: number;
  image_url?: string;
  stock?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          this.cartItems.set(JSON.parse(saved));
        } catch (e) {
          this.cartItems.set([]);
        }
      }
    }
  }

  private saveCart() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  addToCart(item: CartItem) {
    const current = this.cartItems();
    const existingIndex = current.findIndex(i => i.product_id === item.product_id && i.size === item.size);
    
    if (existingIndex > -1) {
      const updated = [...current];
      // Avoid exceeding stock
      const newQuantity = updated[existingIndex].quantity + item.quantity;
      updated[existingIndex].quantity = newQuantity > (item.stock || 999) ? (item.stock || 999) : newQuantity;
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...current, item]);
    }
    this.saveCart();
  }

  removeFromCart(productId: string, size: string) {
    this.cartItems.set(this.cartItems().filter(i => !(i.product_id === productId && i.size === size)));
    this.saveCart();
  }

  updateQuantity(productId: string, size: string, quantity: number) {
    const current = this.cartItems();
    const index = current.findIndex(i => i.product_id === productId && i.size === size);
    if (index > -1 && quantity > 0) {
      const updated = [...current];
      const stock = updated[index].stock || 999;
      updated[index].quantity = quantity > stock ? stock : quantity;
      this.cartItems.set(updated);
      this.saveCart();
    }
  }

  clearCart() {
    this.cartItems.set([]);
    this.saveCart();
  }

  // Se expone para ser llamado como computada / señal
  get totalItems(): number {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }
}
