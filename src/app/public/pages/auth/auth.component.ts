import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, NgIf, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  hidePassword: boolean = true; // État pour gérer la visibilité du mot de passe

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.router.navigate(['/test']); // Redirection après connexion réussie
        },
        error: () => {
          this.errorMessage = "Échec de la connexion. Vérifiez vos identifiants.";
        }
      });
    }
  }
}