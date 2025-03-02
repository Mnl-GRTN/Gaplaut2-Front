import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';

import { MatButton } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { VaccinationService } from '../../../core/services/vaccination.service';
import { Center } from '../../../core/services/center';
import { Vaccination } from '../../../core/services/vaccination';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [ FormsModule, MatButton, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatAutocompleteModule, MatIconModule, NgIf, ReactiveFormsModule ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent {
  
  @ViewChild('appointmentForm') appointmentForm!: NgForm;
  @Input() selectedCentre?: Center;
  @Output() backToSearch = new EventEmitter<void>();

  minDate: Date = new Date(); // today
  isSubmitted: boolean = false;
  errorMessage: string = '';
  formattedDate: string = '';
  dateInvalid: boolean = false;
  phoneInvalid: boolean = false;

  dateControl = new FormControl(this.minDate); // Pour le datepicker
  
  constructor(private vaccinationService: VaccinationService, private datePipe: DatePipe) {
    this.minDate.setHours(0, 0, 0, 0); // Normaliser l'heure
    this.formattedDate = this.datePipe.transform(this.minDate, 'dd/MM/yyyy') || ''; 
    this.vaccination.date = this.datePipe.transform(this.minDate, 'yyyy-MM-dd') || '';
  }
  
  

  vaccination: Vaccination = {
    centre: { id: 0 },
    mail: '',
    phoneNumber: '',
    last_name: '',
    first_name: '',
    date: new Date().toISOString(),
    isVaccined: false
  };

  onDateSelection(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.minDate.setHours(0, 0, 0, 0); // Normalize time
  
      if (event.value < this.minDate) {
        this.dateInvalid = true;
        this.formattedDate = '';
        this.vaccination.date = '';
        return;
      }
  
      // Convert date to 'YYYY-MM-DD' format without altering time zone
      const localDate = new Date(event.value.getTime() - event.value.getTimezoneOffset() * 60000);
      this.vaccination.date = this.datePipe.transform(event.value, 'yyyy-MM-dd') || '';
  
      this.dateInvalid = false;
    }
  }
  
  validateDate(event: any) {
    const inputValue = event.target.value.trim();
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  
    if (!dateRegex.test(inputValue)) {
      this.dateInvalid = true;
      return;
    }
  
    // Extraction du jour, mois, année
    const [day, month, year] = inputValue.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalisation
  
    // Vérifie si la date est valide et n'est pas passée
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date >= today
    ) {
      this.vaccination.date = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
      this.dateInvalid = false;
      
    } else {
      this.dateInvalid = true;
    }
  }


  validatePhone(event: any): void {
    const value = event.target.value.replace(/\D/g, ''); // Supprime tout sauf les chiffres
    event.target.value = value; // Met à jour l'input immédiatement
    this.vaccination.phoneNumber = value;
  
    this.phoneInvalid = value.length !== 10; // Vérifie si ce n'est pas 10 chiffres
  }

  submitAppointment(): void {
    if (this.selectedCentre) {
      this.vaccination.centre.id = this.selectedCentre.id;
      this.vaccinationService.postVaccinationAppointment(this.vaccination).subscribe({
        next: () => {
          this.errorMessage = '';
          this.isSubmitted = true;
          this.appointmentForm.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Une erreur est survenue lors de la prise de rendez-vous. Veuillez réessayer plus tard.';
          console.error('Error submitting appointment:', err);
        }
      });
    }
  }

  goBack(): void {
    this.isSubmitted = false;
    this.errorMessage = '';
    this.backToSearch.emit();
  }

  resetAppointmentForm() {
    this.appointmentForm.resetForm();
  }
  
}
