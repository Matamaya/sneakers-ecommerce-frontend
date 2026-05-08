import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-catalog',
  imports: [RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  products = signal<Product[]>([
    {
      id: '1',
      name: 'AirStride Pro',
      brand: 'AIRSTIDE',
      price: 129.99,
      stock: 89,
      category: 'RUNNING',
      imageUrl: ''
    },
    {
      id: '2',
      name: 'SpeedFlow Elite',
      brand: 'SPEEDFLOW',
      price: 149.99,
      stock: 30,
      category: 'RUNNING',
      imageUrl: ''
    },
    {
      id: '3',
      name: 'CourtKing High',
      brand: 'COURTKING',
      price: 159.99,
      stock: 25,
      category: 'BASKETBALL',
      imageUrl: ''
    },
    {
      id: '4',
      name: 'UrbanStep Classic',
      brand: 'URBANSTEP',
      price: 89.99,
      stock: 75,
      category: 'LIFESTYLE',
      imageUrl: ''
    },
    {
      id: '5',
      name: 'FlexForce Trainer',
      brand: 'FLEXFORCE',
      price: 109.99,
      stock: 40,
      category: 'BASKETBALL',
      imageUrl: ''
    }
  ]);

  categories = ['Todas', 'Basketball', 'Lifestyle', 'Running', 'Training'];
  selectedCategory = signal<string>('Todas');
  searchText = signal<string>('');

  filteredProducts = computed(() => {
    const search = this.searchText().toLowerCase();
    const category = this.selectedCategory();
    
    return this.products().filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search) || product.brand.toLowerCase().includes(search);
      const matchesCategory = category === 'Todas' || product.category === category.toUpperCase();
      return matchesSearch && matchesCategory;
    });
  });

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchText.set(target.value);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
