import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { VaccinationService } from '../../../core/services/vaccination.service';
import { Center } from '../../../core/services/center';
import { Vaccination } from '../../../core/services/vaccination';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

import { MatButton } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ FormsModule, MatButton, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatAutocompleteModule, MatIconModule, NgIf ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent {
  
  @ViewChild('appointmentForm') appointmentForm!: NgForm;
  @Input() selectedCentre?: Center;
  @Output() appointmentSubmitted = new EventEmitter<void>();
  @Output() backToSearch = new EventEmitter<void>();
  minDate: Date = new Date();

  constructor(private vaccinationService: VaccinationService) {}

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
    const date = event.value!;
    this.vaccination.date = date.toISOString().split('T')[0];
  }

  submitAppointment(): void {
    if (this.selectedCentre) {
      this.vaccination.centre.id = this.selectedCentre.id;
      this.vaccinationService.postVaccination(this.vaccination).subscribe(() => {
        this.appointmentSubmitted.emit(); 
      });
    }
  }

  clearSelection(): void {
    this.appointmentForm.resetForm();
    this.backToSearch.emit();
  }
  
}
