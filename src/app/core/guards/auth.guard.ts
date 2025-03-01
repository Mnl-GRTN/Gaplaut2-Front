import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Check if the user is authenticated and has the required roles to access the route
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard'], { queryParams: { returnUrl: state.url } });
      return of(false); // Return false if the user is not authenticated
    }

    return this.authService.fetchUserInfo().pipe(
      map((userInfo) => {
        const requiredRoles = route.data['roles'] as Array<string>;
        if (requiredRoles && !requiredRoles.some(role => this.authService.hasRole(role))) {
          this.router.navigate(['/dashboard']); // Redirect to unauthorized page
          return false; // Return false if the user does not have the required roles
        }
        return true; // Return true if the user is authenticated and has the required roles
      }),
      catchError(() => {
        this.router.navigate(['/login']); // Redirect to login page on error
        return of(false); // Return false if there's an error
      })
    );
  }
}