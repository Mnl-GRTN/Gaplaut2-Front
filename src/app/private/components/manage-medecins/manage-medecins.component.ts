import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Doctor } from '../../../core/services/doctor';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';

import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import {MatTableModule} from '@angular/material/table';

import { NgIf, NgFor } from '@angular/common';

import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-manage-medecins',
  standalone: true,
  imports: [MatListModule, NgIf, MatCardModule, MatIconModule, NgFor, MatInputModule, MatButtonModule, MatToolbarModule, MatTableModule, EditUserComponent],
  templateUrl: './manage-medecins.component.html',
  styleUrl: './manage-medecins.component.scss'
})

export class ManageMedecinsComponent implements OnInit {
  @Input() centreId!: number; // Input property to receive the centre ID
  @Output() save = new EventEmitter<void>(); 
  @Output() cancel = new EventEmitter<void>();
  doctors: Doctor[] = [];
  admins: Doctor[] = [];
  errorMessage: string | null = null;
  selectedUser: Doctor | null = null

  displayedColumns: string[] = ['id', 'name', 'email', 'actions']; 

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization'); // Get the auth header

    if (authHeader) {
      this.doctorService.getDoctorsByCentre(this.centreId, authHeader).subscribe(
        (data) => {
          console.log(data);
          this.doctors = data.filter(user => user.roles.some(role => role.roleName === 'doctor')); // Filter doctors
          this.admins = data.filter(user => user.roles.some(role => role.roleName === 'admin')); // Filter admins
        },
        (error) => {
          this.errorMessage = 'Failed to fetch users. Please try again.'; // Display error message
        }
      );
    } else {
      this.errorMessage = 'Authorization header is missing.'; // Display error message
    }
  }

  onSave(): void {
    this.save.emit(); // Émet l'événement pour sauvegarder
  }

  onCancel(): void {
    this.cancel.emit(); // Émet l'événement pour annuler
  }

  onRemove(user: Doctor): void {
    console.log('Remove user:', user);
    const authHeader = this.authService.getAuthHeaders().get('Authorization');
    if (authHeader) {
    this.doctorService.removeDoctorById(user.id, authHeader).subscribe(
      () => {
        this.fetchDoctors(); // Refresh the list of doctors
      }
    );
    } else {
      this.errorMessage = 'Authorization header is missing.';
    }
  }

  // Edit User Component

  onEdit(user: Doctor): void {
    this.selectedUser = user; // Set selected user for editing
  }

  onSaveUser(user: Doctor): void {
    console.log('User saved:', user);
    // Handle saving the user (send to API)
    this.selectedUser = null; // Reset after saving
  }

  onCancelEdit(): void {
    this.selectedUser = null; // Reset if cancelled
  }
}
