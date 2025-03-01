import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Doctor } from '../../../core/services/doctor';
import { DoctorService } from '../../../core/services/doctor.service';
import { Role } from '../../../core/services/role';
import { RoleService } from '../../../core/services/role.service';
import { CenterService } from '../../../core/services/center.service';
import { AuthService } from '../../../core/services/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardContent } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    NgFor,
    MatFormFieldModule,
    MatCardContent,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnInit {
  @Input() user!: Doctor | undefined; // Input property to receive the user data
  @Input() newUser: boolean = false; // Input property to determine if the user is new
  @Output() save = new EventEmitter<Doctor>();
  @Output() cancel = new EventEmitter<void>();

  roles: any[] = [];
  centres: any[] = [];
  errorMessage: string | null = null;

  isCentreDisabled: boolean = false;
  originalPassword: string = '';
  private previousCentreId: number | null = null;

  constructor(
    private doctorService: DoctorService,
    private roleService: RoleService,
    private centreService: CenterService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.user) {
      // If no user data, initialize with default empty fields for new user
      this.user = {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roles: [{ id: 0, roleName: '' }],
        centre: { id: 0, centreName: '', city: '', address: '', postalCode: '' },
        passwordChanged: true, // For new users, always hash the password
      };
    } else {
      this.originalPassword = this.user.password; // Store the original password
      this.user.passwordChanged = false; // Default to false for existing users

      if (this.user.roles.some((role) => role.id == 1)) {
        this.isCentreDisabled = true; // Disable the centre field
      }
    }

    this.fetchRoles();
    this.fetchCentres();
  }

  fetchRoles(): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization');

    if (authHeader) {
      this.roleService.getRoles(authHeader).subscribe(
        (roles: any[]) => {
          this.roles = roles;
        },
        (error: any) => {
          this.errorMessage = 'Echo de la récupération des rôles.';
        }
      );
    } else {
      this.errorMessage = 'Authorization header is missing.';
    }
  }

  fetchCentres(): void {
    this.centreService.getVaccinationCenters().subscribe(
      (centres: any[]) => {
        this.centres = centres;
      },
      (error: any) => {
        this.errorMessage = 'Echec de la récupération des centres.';
      }
    );
  }

  onRoleChange(roleId: string): void {
    if (roleId == '1') { // If superadmin
      this.previousCentreId = this.user!.centre.id; // Save the previous centre
      this.user!.centre.id = 1; // Set the centre to 1
      this.isCentreDisabled = true; // Disable the centre field
    } else {
      if (this.previousCentreId) {
        this.user!.centre.id = this.previousCentreId; // Restore the previous centre
      }
      this.isCentreDisabled = false; // Enable the centre field
    }
  }

  onSubmit(): void {
    if (!this.user || !this.user.firstName || !this.user.lastName || 
      !this.user.email || !this.user.password || !this.user.centre.id) {
      this.errorMessage = 'Tous les champs doivent être remplis.';
      return;
    }

    if (this.user.roles[0].id !== 1 && this.user.centre.id === 1) {
      this.errorMessage = 'Un centre doit être sélectionné pour les utilisateurs non superadmins.';
      return;
    }

    if (this.user.password !== this.originalPassword) {
      this.user.passwordChanged = true;
    }

    const updatedDoctor: Doctor = {
      ...this.user,
    };

    if (updatedDoctor.roles.some((role) => role.roleName === 'superadmin')) {
      updatedDoctor.centre.id = 1; // Set centre to 1 when the role is superadmin
      this.isCentreDisabled = true; // Disable the centre field in the form
    }

    const authHeader = this.authService.getAuthHeaders().get('Authorization'); // Get the auth header

    if (authHeader) {

    if(this.newUser) {
      this.doctorService.addDoctor(updatedDoctor, authHeader).subscribe(
        () => {
          this.save.emit(updatedDoctor); // Emit the updated doctor on success
          this.snackBar.open('User added successfully!', 'Close', {
            duration: 3000, // Display for 3 seconds
          });
        },
        (error: any) => {
          this.errorMessage = error.message || 'Erreur lors de l\'ajout de l\'utilisateur.'; // Display error message
        }
      );
    } else
      this.doctorService.updateDoctorById(updatedDoctor.id, updatedDoctor, authHeader).subscribe(
        () => {
          this.save.emit(updatedDoctor); // Emit the updated doctor on success
          this.snackBar.open('User updated successfully!', 'Close', {
            duration: 3000, // Display for 3 seconds
          });
        },
        (error: any) => {
          this.errorMessage = error.message || 'Erreur lors de la mise à jour de l\'utilisateur.'; // Display error message
        }
      );
    } else {
      this.errorMessage = 'Authorization header is missing.'; // Display error message
    }
  }

  onCancel(): void {
    this.cancel.emit(); // Emit the cancel event
  }
}