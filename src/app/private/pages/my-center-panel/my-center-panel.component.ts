import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CenterService } from '../../../core/services/center.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Center } from '../../../core/services/center';
import { Doctor } from '../../../core/services/doctor';
import { MatSnackBar } from '@angular/material/snack-bar';

import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import {MatTableModule} from '@angular/material/table';


import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { UserTableComponent } from '../../components/user-table/user-table.component';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

import { NgIf } from '@angular/common';

@Component({
  selector: 'app-my-center-panel',
  standalone: true,
  imports: [MatListModule, MatCardModule, MatIconModule, MatInputModule, MatButtonModule, MatToolbarModule, MatTableModule, UserTableComponent, NgIf, EditUserComponent],
  templateUrl: './my-center-panel.component.html',
  styleUrl: './my-center-panel.component.scss'
})
export class MyCenterPanelComponent implements OnInit {

  centre: Center | null = null; // Centre linked to the user
  doctors: Doctor[] = []; // Doctors associated with the centre
  errorMessage: string | null = null;

  selectedUser: Doctor | null = null; // Selected user for editing
  newUser: boolean = false; // Flag for new user
  centerLocked: boolean = false; // Flag to lock the centre field
  roleLocked: boolean = false; // Flag to lock the role field

  constructor(
    private authService: AuthService,
    private centerService: CenterService,
    private doctorService: DoctorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCentreAndDoctors();
  }

  fetchCentreAndDoctors(): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization');
    const userInfo = this.authService.getUserInfo();

    if (authHeader && userInfo) {
      // Fetch the centre linked to the user
      this.centerService.getOneVaccinationCenter(userInfo.centre).subscribe(
        (centre) => {
          this.centre = centre;

          // Fetch doctors associated with the centre
          this.doctorService.getDoctorsByCentre(centre.id, authHeader).subscribe(
            (doctors) => {
              this.doctors = doctors.filter((doctor) =>
                doctor.roles.some((role) => role.roleName === 'doctor')
              );
            },
            (error) => {
              this.errorMessage = 'Erreur lors de la récupération des docteurs.';
            }
          );
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération du centre.';
        }
      );
    } else {
      this.errorMessage = 'Authorization header is missing or user info not found.';
    }
  }

  onAddDoctor(): void {
      if (this.centre) {
        const newUser: Doctor = {
          id: 0, // ID will be assigned by the backend
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          roles: [{ id: 3, roleName: 'doctor' }], // Assign the doctor role
          centre: { id: this.centre.id, centreName: this.centre.centreName, city: this.centre.city, address: this.centre.address, postalCode: this.centre.postalCode },
          passwordChanged: true // For new users, always hash the password
        };
      this.selectedUser = newUser; // Set the new user for editing
      this.newUser = true; // Set the flag for new user
      this.centerLocked = true; // Lock the centre field
      }
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
                this.fetchCentreAndDoctors(); // Refresh the list of doctors
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
      this.roleLocked = true; // Lock the role field
      this.centerLocked = true; // Lock the centre field
    }
  
    onSaveUser(user: Doctor): void {
      // Handle saving the user (send to API)
      this.selectedUser = null; // Reset after saving
      this.fetchCentreAndDoctors(); // Refresh the list of doctors
    }
  
    onCancelEdit(): void {
      this.selectedUser = null; // Reset if cancelled
    }
}
