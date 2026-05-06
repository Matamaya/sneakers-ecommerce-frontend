import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Si está logueado, le dejamos pasar
  } else {
    // Si no está logueado, lo mandamos al login
    router.navigate(['/login']);
    return false;
  }
};