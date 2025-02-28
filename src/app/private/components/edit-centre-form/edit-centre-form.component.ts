import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { Center } from '../../../core/services/center';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../../core/services/auth.service';
import { CenterService } from '../../../core/services/center.service';

@Component({
  selector: 'app-edit-centre-form',
  standalone: true,
  providers: [],
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatToolbarModule, FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './edit-centre-form.component.html',
  styleUrl: './edit-centre-form.component.scss'
})

export class EditCentreFormComponent implements OnInit {
  @Input() centre!: Center; // Input property to receive the centre data
  @Output() save = new EventEmitter<Center>(); // Output event to emit the updated centre
  @Output() cancel = new EventEmitter<void>(); // Output event to cancel editing

  editForm!: FormGroup;
  errorMessage: string | null = null; // To display error messages

  constructor(
    private fb: FormBuilder,
    private centerService: CenterService, // Inject CenterService
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Initialize the form with the centre data
  initForm(): void {
    this.editForm = this.fb.group({
      centreName: [this.centre.centreName, Validators.required],
      city: [this.centre.city, Validators.required],
      address: [this.centre.address, Validators.required],
      postalCode: [this.centre.postalCode, [Validators.required, Validators.pattern(/^\d{5}$/)]]
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedCentre: Center = {
        ...this.centre,
        ...this.editForm.value
      };

      const authHeader = this.authService.getAuthHeaders().get('Authorization'); // Get the auth header

      if (authHeader) {
        this.centerService.updateCentre(updatedCentre.id, updatedCentre, authHeader).subscribe(
          () => {
            this.save.emit(updatedCentre); // Emit the updated centre on success
          },
          (error: any) => {
            this.errorMessage = 'Failed to update the centre. Please try again.'; // Display error message
          }
        );
      } else {
        this.errorMessage = 'Authorization header is missing.'; // Display error message
      }
    }
  }

  // Handle cancel button click
  onCancel(): void {
    this.cancel.emit(); // Emit the cancel event
  }
}