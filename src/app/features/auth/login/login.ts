import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Necesario para ngModel
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  // Variables enlazadas al formulario
  email = '';
  password = '';
  errorMessage = '';

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Redirigir según el rol del usuario (navbar se actualizará automáticamente gracias a signals)
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/products']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        // Si falla (contraseña incorrecta, etc.)
        console.error(err);
        this.errorMessage = 'Email o contraseña incorrectos.';
      }
    });
  }
}