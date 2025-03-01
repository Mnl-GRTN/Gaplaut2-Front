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

import { MatSnackBar } from '@angular/material/snack-bar';

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

  newUser: boolean = false;

  displayedColumns: string[] = ['id', 'name', 'email', 'actions']; 

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization'); // Get the auth header

    if (authHeader) {
      this.doctorService.getDoctorsByCentre(this.centreId, authHeader).subscribe(
        (data) => {
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
    const authHeader = this.authService.getAuthHeaders().get('Authorization');
    if (authHeader) {
    this.doctorService.removeDoctorById(user.id, authHeader).subscribe(
      () => {
        this.fetchDoctors(); // Refresh the list of doctors
        this.snackBar.open('Utilisateur supprimé avec succès.', 'Fermer', { duration: 3000 });
      }
    );
    } else {
      this.errorMessage = 'Authorization header is missing.';
    }
  }

  // Edit User Component

  onEdit(user: Doctor): void {
    this.selectedUser = user; // Set selected user for editing
    this.newUser = false; // Reset the flag for new user
  }

  onSaveUser(user: Doctor): void {
    // Handle saving the user (send to API)
    this.selectedUser = null; // Reset after saving
    this.fetchDoctors(); // Refresh the list of doctors
  }

  onCancelEdit(): void {
    this.selectedUser = null; // Reset if cancelled
  }

  onAddUser(role: 'admin' | 'doctor'): void {
    const newUser: Doctor = {
      id: 0, // ID will be assigned by the backend
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roles: [{ id: role === 'admin' ? 2 : 3, roleName: role }], // Assign role ID based on role
      centre: { id: this.centreId, centreName: '', city: '', address: '', postalCode: '' }, // Assign the current centre
      passwordChanged: true // For new users, always hash the password
    };
    this.selectedUser = newUser; // Set the new user for editing
    this.newUser = true; // Set the flag for new user
  }
}
