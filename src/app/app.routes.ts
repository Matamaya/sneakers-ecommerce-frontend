import { Routes } from '@angular/router';

// Importamos los componentes (asegúrate de que las rutas coincidan con tu estructura)
import { Home } from './features/public/home/home';
import { Catalog } from './features/public/catalog/catalog';
import { ProductDetail } from './features/public/product-detail/product-detail';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Cart } from './features/user/cart/cart';
import { MyOrders } from './features/user/my-orders/my-orders';
import { AdminProducts } from './features/admin/admin-products/admin-products';
import { AdminOrders } from './features/admin/admin-orders/admin-orders';

import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  // =========================================
  // RUTAS PÚBLICAS (Accesibles por todos)
  // =========================================
  { path: '', component: Home }, // Pantalla principal
  { path: 'catalog', component: Catalog }, // Catálogo general
  { path: 'product/:id', component: ProductDetail }, // Detalle de un producto específico
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // =========================================
  // RUTAS DE USUARIO (Requieren estar logueado)
  // =========================================
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'my-orders', component: MyOrders, canActivate: [authGuard] },

  // =========================================
  // RUTAS DE ADMINISTRADOR (Requieren rol Admin)[cite: 1]
  // =========================================
  { path: 'admin/products', component: AdminProducts, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrders, canActivate: [adminGuard] },

  // =========================================
  // RUTA COMODÍN (Si la URL no existe, redirige al inicio)
  // =========================================
  { path: '**', redirectTo: '', pathMatch: 'full' }
];