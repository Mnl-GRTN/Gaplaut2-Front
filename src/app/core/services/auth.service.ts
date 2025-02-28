import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'private/api/auth/user-info'; // Endpoint to fetch user info
  private userRoles: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.fetchUserInfo(); // Fetch user info on service initialization
  }

  // Fetch user info from the backend 
  public fetchUserInfo(): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      const headers = new HttpHeaders({ Authorization: authToken });

      return this.http.get<any>(this.apiUrl, { headers }).pipe(
        tap((userInfo) => {
          this.userRoles = userInfo.authorities; // Store user roles
        }),
        catchError(() => {
          this.logout(); // Log out if there's an error (e.g., token expired)
          return of(null);
        })
      );
    }
    return of(null);
  }

  login(username: string, password: string): Observable<any> {
    const authHeader = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({ Authorization: authHeader });

    return this.http.get(this.apiUrl, { headers }).pipe(
      tap((userInfo: any) => {
        sessionStorage.setItem('authToken', authHeader); // Store auth header
        this.userRoles = userInfo.authorities; // Store user roles
      })
    );
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    this.userRoles = [];
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders(token ? { Authorization: token } : {});
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }
}