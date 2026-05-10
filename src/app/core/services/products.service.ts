import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string | number;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category_id: string | number;
  categories?: { name: string, slug: string };
  image_url?: string;
  imageUrl?: string;
  sizes?: any;
  description?: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  private getHeaders() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getProducts(): Observable<{ data: Product[], total: number }> {
    return this.http.get<{ data: Product[], total: number }>(`${this.apiUrl}/products?limit=100`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, formData, { headers: this.getHeaders() });
  }

  updateProduct(id: string, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, formData, { headers: this.getHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
  }
}
