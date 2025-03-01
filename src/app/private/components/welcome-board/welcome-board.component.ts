import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-welcome-board',
  standalone: true,
  imports: [ MatButtonModule, MatSelectModule, MatInputModule, MatIconModule, MatCardContent, MatToolbar, MatCardHeader, MatCardTitle, MatCard ],
  templateUrl: './welcome-board.component.html',
  styleUrl: './welcome-board.component.scss'
})
export class WelcomeBoardComponent implements OnInit {

  user: { name: string, email: string, role: string } | null = null;

  constructor() { }

  ngOnInit(): void {
    // Simuler la récupération des informations de l'utilisateur
    this.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin'
    };
  }
}