import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService, Product, Category } from '../../../core/services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  productsService = inject(ProductsService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string | number>('Todas');
  searchText = signal<string>('');
  isLoading = signal<boolean>(true);

  filteredProducts = computed(() => {
    const search = this.searchText().toLowerCase();
    const categoryId = this.selectedCategoryId();
    
    return this.products().filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search) || (product.brand && product.brand.toLowerCase().includes(search));
      const matchesCategory = categoryId === 'Todas' || product.category_id === categoryId;
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.isLoading.set(false);
      }
    });
  }

  loadCategories() {
    this.productsService.getCategories().subscribe({
      next: (res) => this.categories.set(res),
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchText.set(target.value);
  }

  selectCategory(id: string | number) {
    this.selectedCategoryId.set(id);
  }
}
