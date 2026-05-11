import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product, Category } from '../../../core/services/products.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-products.html'
})
export class AdminProducts implements OnInit {
  
  productsService = inject(ProductsService);

  // Estado de la ventana lateral
  isSidebarOpen = signal(false);
  editingProductId = signal<string | null>(null);

  // Objeto temporal para el formulario del producto usando un Signal reactivo
  productForm = signal({
    name: '',
    brand: '',
    category_id: '',
    price: 0,
    stock: 0,
    sizes: '',
    sizesStock: '',
    description: ''
  });

  selectedFile = signal<File | null>(null);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (res) => this.products.set(res.data || []),
      error: (err) => console.error('Error fetching products', err)
    });
  }

  loadCategories() {
    this.productsService.getCategories().subscribe({
      next: (res) => this.categories.set(res),
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  openSidebar() {
    this.editingProductId.set(null);
    this.resetForm();
    this.isSidebarOpen.set(true);
  }

  editProduct(product: Product) {
    this.editingProductId.set(product.id);
    
    // Convertir el JSON/array de tallas a texto separado por comas
    let sizesStr = '';
    let sizesStockStr = '';
    if (product.sizes) {
      try {
        let sizesArray = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
        if (Array.isArray(sizesArray)) {
          sizesStr = sizesArray.map(s => (typeof s === 'object' && s !== null) ? (s.size || '') : s).filter(val => val !== '').join(', ');
          sizesStockStr = sizesArray.map(s => (typeof s === 'object' && s !== null) ? (s.stock !== undefined ? s.stock : '') : '').join(', ');
        } else {
          sizesStr = String(product.sizes);
        }
      } catch (e) {
        sizesStr = String(product.sizes);
      }
    }

    // Forzamos la actualización del Signal con los datos precisos
    this.productForm.set({
      name: product.name || '',
      brand: product.brand || '',
      category_id: String(product.category_id || ''),
      price: product.price || 0,
      stock: product.stock || 0,
      sizes: sizesStr,
      sizesStock: sizesStockStr,
      description: product.description || '',
    });
    
    this.selectedFile.set(null);
    this.isSidebarOpen.set(true);
  }

  updateField(field: string, value: any) {
    this.productForm.update(current => ({
      ...current,
      [field]: value
    }));
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
    this.editingProductId.set(null);
    this.resetForm();
  }

  private resetForm() {
    this.productForm.set({
      name: '', brand: '', category_id: '', price: 0, stock: 0,
      sizes: '', sizesStock: '', description: ''
    });
    this.selectedFile.set(null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  saveProduct() {
    const formDataObj = this.productForm();
    if (!formDataObj.name || formDataObj.price === null || formDataObj.price === undefined || !formDataObj.category_id) {
      alert('Nombre, precio y categoría son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('name', formDataObj.name);
    formData.append('brand', formDataObj.brand);
    formData.append('category_id', formDataObj.category_id);
    formData.append('price', String(formDataObj.price));
    formData.append('stock', String(formDataObj.stock));
    formData.append('description', formDataObj.description);

    // Formatear tallas
    const sizesArr = (formDataObj.sizes || '').split(',').map(s => s.trim()).filter(s => s);
    const stockArr = (formDataObj.sizesStock || '').split(',').map(s => Number(s.trim()));
    
    if (sizesArr.length > 0) {
      const sizesJson = sizesArr.map((size, index) => ({
        size: size,
        stock: stockArr[index] || 0
      }));
      formData.append('sizes', JSON.stringify(sizesJson));
    }

    if (this.selectedFile()) {
      formData.append('image', this.selectedFile() as File);
    }

    const currentId = this.editingProductId();

    if (currentId) {
      this.productsService.updateProduct(currentId, formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeSidebar();
        },
        error: (err) => alert('Error al actualizar el producto: ' + err.message)
      });
    } else {
      this.productsService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeSidebar();
        },
        error: (err) => alert('Error al crear el producto: ' + err.message)
      });
    }
  }

  deleteProduct(id: string) {
    if(confirm('¿Estás seguro de que deseas eliminar este producto (borrado lógico)?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Error al eliminar producto')
      });
    }
  }
}
