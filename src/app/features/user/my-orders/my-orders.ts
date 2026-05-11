import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdersService, Order } from '../../../core/services/orders.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html'
})
export class MyOrders implements OnInit {
  ordersService = inject(OrdersService);
  
  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);

  expandedOrders = signal<Set<string>>(new Set());

  ngOnInit() {
    this.ordersService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        // Expandir el primero por defecto si existe
        if (data.length > 0) {
          this.expandedOrders.set(new Set([data[0].id]));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  toggleOrder(id: string) {
    const current = new Set(this.expandedOrders());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.expandedOrders.set(current);
  }

  getStatusText(status: string): string {
    const map: Record<string, string> = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return map[status] || status;
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      'pending': 'bg-[#fff8e1] text-[#f59e0b]', // Amarillo suave
      'confirmed': 'bg-[#e0e7ff] text-[#4f46e5]', // Azul suave
      'shipped': 'bg-[#e0e7ff] text-[#4338ca]',
      'delivered': 'bg-[#dcfce7] text-[#16a34a]', // Verde suave
      'cancelled': 'bg-[#fee2e2] text-[#dc2626]'  // Rojo suave
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }
}
