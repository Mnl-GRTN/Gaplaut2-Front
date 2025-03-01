import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';


import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, RouterOutlet, MatSidenavModule, MatToolbarModule, MatListModule, MatButtonModule, RouterModule, MatProgressSpinnerModule, MatIcon],
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
