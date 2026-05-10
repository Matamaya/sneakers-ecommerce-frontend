import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order } from '../../../core/services/orders.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.html'
})
export class AdminOrders implements OnInit {
  ordersService = inject(OrdersService);
  
  orders = signal<Order[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getAllOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error('Error fetching orders:', err)
    });
  }

  changeOrderStatus(orderId: string, newStatus: string) {
    this.ordersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        alert('Error al actualizar el estado: ' + (err.error?.error || err.message));
        this.loadOrders(); 
      }
    });
  }
}
