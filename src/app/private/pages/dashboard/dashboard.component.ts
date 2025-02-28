import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  isRolesLoaded = false;

  constructor(private router: Router, public authService: AuthService) { }

  //This method is called when the component is initialized and fetches the user information (roles) from the server.
  ngOnInit() {
    this.authService.fetchUserInfo().subscribe(() => {
      this.isRolesLoaded = true;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
