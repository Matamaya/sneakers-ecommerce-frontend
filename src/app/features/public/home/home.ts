import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService, Product, Category } from '../../../core/services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  productsService = inject(ProductsService);

  featuredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        // Take first 4 products for featured section
        this.featuredProducts.set((res.data || []).slice(0, 4));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.isLoading.set(false);
      }
    });

    this.productsService.getCategories().subscribe({
      next: (res) => {
        // Take first 4 categories
        this.categories.set(res.slice(0, 4));
      },
      error: (err) => console.error('Error fetching categories', err)
    });
  }
}
