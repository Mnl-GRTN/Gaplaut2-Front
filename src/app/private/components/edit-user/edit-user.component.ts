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
  @Output() save = new EventEmitter<Doctor>();
  @Output() cancel = new EventEmitter<void>();

  roles: any[] = [];
  centres: any[] = [];
  errorMessage: string | null = null;

  isCentreDisabled: boolean = false;
  originalPassword: string = '';

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
    }
    else {
      this.originalPassword = this.user.password; // Store the original password
      this.user.passwordChanged = false; // Default to false for existing users
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
          this.errorMessage = 'Failed to fetch roles.';
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
        this.errorMessage = 'Failed to fetch centres.';
      }
    );
  }

  onRoleChange(role: string): void {
    // Check if the selected role is 'superadmin'
    if (role == '1') {
      this.user!.centre.id = 1; // Set centre to 1 when role is superadmin
      this.isCentreDisabled = true; // Disable the centre input field
    } else {
      this.isCentreDisabled = false; // Enable the centre field for other roles
    }
  }

  onSubmit(): void {
    if (this.user) {

      if (this.user.password !== this.originalPassword) {
        this.user.passwordChanged = true;
      }

      console.log("isPasswordChanged", this.user.passwordChanged);
      const updatedDoctor: Doctor = {
        ...this.user,
      };

      // Check if the role is 'superadmin' and modify the centerId accordingly
      if (updatedDoctor.roles.some((role) => role.roleName === 'superadmin')) {
        updatedDoctor.centre.id = 1; // Set centre to 1 when the role is superadmin
        this.isCentreDisabled = true; // Disable the centre field in the form (e.g., by setting the UI flag)
      }

      const authHeader = this.authService.getAuthHeaders().get('Authorization'); // Get the auth header

      if (authHeader) {
        this.doctorService.updateDoctorById(updatedDoctor.id, updatedDoctor, authHeader).subscribe(
          () => {
            this.save.emit(updatedDoctor); // Emit the updated doctor on success
            this.snackBar.open('User updated successfully!', 'Close', {
              duration: 3000, // Display for 3 seconds
              panelClass: ['success-snackbar'], // Optional: Add custom styling
            });
          },
          (error: any) => {
            this.errorMessage = 'Failed to update the doctor. Please try again.'; // Display error message
          }
        );
      } else {
        this.errorMessage = 'Authorization header is missing.'; // Display error message
      }
    }
  }

  onCancel(): void {
    this.cancel.emit(); // Emit the cancel event
  }
}