import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'private/api/auth/user-info'; // Ensure this is a private endpoint that requires authentication

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const authHeader = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({ Authorization: authHeader });

    return this.http.get(this.apiUrl, { headers }).pipe(
      tap(() => {
        sessionStorage.setItem('authToken', authHeader); // Store auth header
      })
    );
  }

  // Check if user has required role
  hasRole(requiredRole: string): boolean {
    const userRoles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    return userRoles.includes(requiredRole);
  }
  

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders(token ? { Authorization: token } : {});
  }
}
