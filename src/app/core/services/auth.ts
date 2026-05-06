import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos Signals (Angular moderno) para que la UI reaccione a los cambios
  currentUser = signal<{ email: string, role: string } | null>(null);

  constructor() {
    this.checkToken(); // Al cargar la app, comprobamos si ya hay un token
  }

  // Método simulado para procesar el JWT (cuando conectes con el backend real)
  // Como tu arquitectura usa JWT, decodificaremos el payload aquí.
  private decodeToken(token: string) {
    try {
      // Un JWT tiene 3 partes. La del medio (índice 1) es el payload con los datos.
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return { email: decoded.email, role: decoded.role };
    } catch (e) {
      return null;
    }
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = this.decodeToken(token);
      this.currentUser.set(userData);
    } else {
      this.currentUser.set(null);
    }
  }

  // Métodos útiles para los Guards y el Navbar
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin'; // Rol admin definido en tu BD de Supabase
  }

  // Se llamará al hacer login exitoso
  setSession(token: string): void {
    localStorage.setItem('token', token);
    this.checkToken();
  }

  // Se llamará al hacer logout
  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}