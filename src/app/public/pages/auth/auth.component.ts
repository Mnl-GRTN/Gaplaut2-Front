import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, NgIf, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, NavbarComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  hidePassword: boolean = true; // État pour gérer la visibilité du mot de passe

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check if the user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.authService.fetchUserInfo().subscribe({
        next: () => {
          // Redirect to the dashboard and show a snack bar message
          this.router.navigate(['/dashboard']);
          this.snackBar.open("Vous êtes déjà connecté.", "Fermer", {
            duration: 3000, // Display for 3 seconds
          });
        },
        error: () => {
          // If the token is invalid, clear the session and stay on the login page
          this.authService.logout();
        }
      });
    }
  }

  onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']); // Redirection après connexion réussie
        },
        error: () => {
          this.errorMessage = "Échec de la connexion. Vérifiez vos identifiants.";
        }
      });
    }
  }
}