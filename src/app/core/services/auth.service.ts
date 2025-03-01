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
  private userInfo: { email: string, role: string, centre: number } | null = null; // Store user info

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
          this.userInfo = { // Store user info
            email: userInfo.username,
            // Extract the role from the authority string (e.g., 'ROLE_ADMIN' -> 'ADMIN')
            role: userInfo.authorities[0].split('_')[1],
            centre: userInfo.centre
          };
        }),
        catchError((error) => {
          console.error('Error fetching user info:', error);
          this.logout(); // Log out if there's an error (e.g., token expired)
          return of(null);
        })
      );
    } else {
      return of(null); // Return null if no auth token is found
    }
  }

  // Login the user and store the auth token and roles
  login(username: string, password: string): Observable<any> {
    const authHeader = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({ Authorization: authHeader });

    return this.http.get(this.apiUrl, { headers }).pipe(
      tap((userInfo: any) => {
        sessionStorage.setItem('authToken', authHeader); // Store auth header
        this.userRoles = userInfo.authorities; // Store user roles
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error; // Re-throw the error to handle it in the component
      })
    );
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  // Log out the user and clear session data
  logout(): void {
    sessionStorage.removeItem('authToken');
    this.userRoles = [];
    this.router.navigate(['/login']);
  }

  // Get the authorization headers
  getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders(token ? { Authorization: token } : undefined);
  }

  // Check if the user has a specific role
  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  // Get the current user's roles
  getRoles(): string[] {
    return this.userRoles;
  }

  // Get the stored user info
  getUserInfo(): { email: string, role: string, centre: number } | null {
    return this.userInfo;
  }
}