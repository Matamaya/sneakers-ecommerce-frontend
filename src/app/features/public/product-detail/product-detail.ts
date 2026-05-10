import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  selectedSize = signal<string>('');
  quantity = signal<number>(1);
  isLoading = signal<boolean>(true);

  availableStock = computed(() => {
    const p = this.product();
    if (!p || !p.sizes) return 0;
    const sizeObj = p.sizes.find((s: any) => s.size == this.selectedSize());
    return sizeObj ? sizeObj.stock : 0;
  });

  ngOnInit() {
    const idOrSlug = this.route.snapshot.paramMap.get('id');
    if (idOrSlug) {
      this.productsService.getProduct(idOrSlug).subscribe({
        next: (data) => {
          this.product.set(data);
          this.isLoading.set(false);
          // Seleccionar primera talla con stock por defecto
          if (data.sizes && Array.isArray(data.sizes)) {
            const availableSize = data.sizes.find((s: any) => s.stock > 0);
            if (availableSize) {
              this.selectedSize.set(String(availableSize.size));
            }
          }
        },
        error: (err) => {
          console.error('Error fetching product', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  selectSize(size: string) {
    const p = this.product();
    if (!p || !p.sizes) return;
    const sizeObj = p.sizes.find((s: any) => s.size == size);
    if (sizeObj && sizeObj.stock > 0) {
      this.selectedSize.set(String(size));
      this.quantity.set(1); // Reset quantity when changing size
    }
  }

  incrementQuantity() {
    if (this.quantity() < this.availableStock()) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    const p = this.product();
    if (!p || !this.selectedSize() || this.quantity() < 1) return;

    this.cartService.addToCart({
      product_id: p.id,
      name: p.name,
      brand: p.brand || '',
      price: p.price,
      size: this.selectedSize(),
      quantity: this.quantity(),
      image_url: p.image_url,
      stock: this.availableStock()
    });
    
  }
}
