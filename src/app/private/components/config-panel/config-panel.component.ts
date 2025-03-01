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
import { UserTableComponent } from '../user-table/user-table.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-config-panel',
  standalone: true,
  imports: [MatListModule, NgIf, MatCardModule, MatIconModule, NgFor, MatInputModule, MatButtonModule, MatToolbarModule, MatTableModule, EditUserComponent, UserTableComponent],
  templateUrl: './config-panel.component.html',
  styleUrl: './config-panel.component.scss'
})
export class ConfigPanelComponent {
  @Output() save = new EventEmitter<void>(); 
  @Output() cancel = new EventEmitter<void>();
  superadmins: Doctor[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'actions']; 
  errorMessage: string | null = null;

  selectedUser: Doctor | null = null

  newUser: boolean = false;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization'); // Get the auth header

    if (authHeader) {
      this.doctorService.getDoctors(authHeader).subscribe(
        (data) => {
          this.superadmins = data.filter(user => user.roles.some(role => role.roleName === 'superadmin')); // Filter superadmins
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des superadmins';
        }
      );
    }
  }

  onAddSuperAdmin(): void {
    const newUser: Doctor = {
      id: 0, // ID will be assigned by the backend
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roles: [{ id: 1, roleName: 'superadmin' }], // Assign the superadmin role
      centre: { id: 1, centreName: '', city: '', address: '', postalCode: '' }, // Assign a dummy centre with ID 1 (default)
      passwordChanged: true // For new users, always hash the password
    };
    this.selectedUser = newUser; // Set the new user for editing
    this.newUser = true; // Set the flag for new user
  }
  
  onRemove(user: Doctor): void {
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Etes-vous sûr de vouloir supprimer cet utilisateur?' }
    });

    // Handle the result of the dialog
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User confirmed deletion
        const authHeader = this.authService.getAuthHeaders().get('Authorization');
        if (authHeader) {
          this.doctorService.removeDoctorById(user.id, authHeader).subscribe(
            () => {
              this.fetchDoctors(); // Refresh the list of doctors
              this.snackBar.open('Utilisateur supprimé avec succès.', 'Fermer', { duration: 3000 });
            },
            (error) => {
              this.errorMessage = 'Erreur lors de la suppression de l\'utilisateur.'; // Display error message
            }
          );
        } else {
          this.errorMessage = 'Authorization header is missing.';
        }
      }
    });
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
}
