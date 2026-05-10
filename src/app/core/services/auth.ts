import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth'; // la ruta del backend

  currentUser = signal<{ email: string, role: string } | null>(null);

  constructor() {
    this.checkToken();
  }

  // Decodifica el token para saber quién es y qué rol tiene
  private decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const role = decoded.user_metadata?.role || decoded.app_metadata?.role || 'user';
      return { email: decoded.email, role: role };
    } catch (e) {
      return null;
    }
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser.set(this.decodeToken(token));
    } else {
      this.currentUser.set(null);
    }
  }

  // Hace la petición POST a tu backend
  login(email: string, password: string): Observable<any> {
    return this.http.post<{token?: string, access_token?: string}>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Cuando el backend responde con el token, lo guardamos
        const token = response?.access_token || response?.token;
        if (token) {
          localStorage.setItem('token', token);
          this.checkToken();
        }
      })
    );
  }

  // Función de registro real
  register(email: string, password: string, fullName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName });
  }

  isLoggedIn(): boolean { return this.currentUser() !== null; }
  isAdmin(): boolean { return this.currentUser()?.role === 'admin'; }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}