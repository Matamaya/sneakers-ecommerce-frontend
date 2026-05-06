import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true; // Es admin, le dejamos pasar a sus paneles de gestión[cite: 1]
  } else {
    // Si es un usuario normal o no está logueado, lo mandamos al inicio
    router.navigate(['/']);
    return false;
  }
};