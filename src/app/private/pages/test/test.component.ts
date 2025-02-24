import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout(); // Call the logout method from AuthService
    // Optionally, you can redirect to a different page after logout
    console.log('Logged out successfully');
  }

}
