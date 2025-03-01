import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CenterService } from '../../../core/services/center.service';
import { VaccinationService } from '../../../core/services/vaccination.service';
import { Center } from '../../../core/services/center';
import { Vaccination } from '../../../core/services/vaccination';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-planning-panel',
  standalone: true,
  providers: [DatePipe],
  imports: [NgIf, MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatCheckboxModule, MatInputModule, FormsModule, MatSnackBarModule, MatDatepicker, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule],
  templateUrl: './planning-panel.component.html',
  styleUrl: './planning-panel.component.scss'
})

export class PlanningPanelComponent implements OnInit {
  centre: Center | null = null; // Centre linked to the user
  selectedDate: string; // Selected date for vaccinations
  vaccinations: Vaccination[] = []; // Vaccinations for the selected date
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private centerService: CenterService,
    private vaccinationService: VaccinationService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ) {
    // Set the default date to today
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.fetchCentreAndVaccinations();
  }

  fetchCentreAndVaccinations(): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization');
    const userInfo = this.authService.getUserInfo();

    if (authHeader && userInfo) {
      // Fetch the centre linked to the user
      this.centerService.getOneVaccinationCenter(userInfo.centre).subscribe(
        (centre) => {
          this.centre = centre;
          this.fetchVaccinationsForDate(this.selectedDate); // Fetch vaccinations for the default date
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération du centre.';
        }
      );
    } else {
      this.errorMessage = 'Authorization header is missing or user info not found.';
    }
  }

  fetchVaccinationsForDate(date: string): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization');
    if (this.centre && authHeader) {
      this.vaccinationService.getVaccinationAppointments(this.centre.id, date, authHeader).subscribe(
        (vaccinations) => {
          this.vaccinations = vaccinations;
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des vaccinations.';
        }
      );
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd') || '';
      this.fetchVaccinationsForDate(this.selectedDate);
    }
  }

  onValidateVaccination(vaccination: Vaccination): void {
    const authHeader = this.authService.getAuthHeaders().get('Authorization');
    if (vaccination.id && authHeader) {
      // User confirmed validation
      this.vaccinationService.updateVaccinationAppointment(vaccination.id, authHeader).subscribe(
        () => {
          this.fetchVaccinationsForDate(this.selectedDate); // Refresh the list of vaccinations
          this.snackBar.open('Vaccination validée avec succès.', 'Fermer', { duration: 3000 });
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la validation de la vaccination.';
        }
      );
    }
  }

  onPreviousDay(): void {
    const previousDay = new Date(this.selectedDate);
    previousDay.setDate(previousDay.getDate() - 1); // Subtract one day
    this.selectedDate = this.datePipe.transform(previousDay, 'yyyy-MM-dd') || '';
    this.fetchVaccinationsForDate(this.selectedDate);
  }
  
  onNextDay(): void {
    const nextDay = new Date(this.selectedDate);
    nextDay.setDate(nextDay.getDate() + 1); // Add one day
    this.selectedDate = this.datePipe.transform(nextDay, 'yyyy-MM-dd') || '';
    this.fetchVaccinationsForDate(this.selectedDate);
  }
}
