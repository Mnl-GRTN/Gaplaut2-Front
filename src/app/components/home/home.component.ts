import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { CenterService } from '../../services/center.service';  // Import du service
import { VaccinationService } from '../../services/vaccination.service';  // Import du service

import { Center } from '../../services/center';  // Import de l'interface Center
import { Vaccination } from '../../services/vaccination';  // Import de l'interface Vaccination

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ FormsModule, NgIf, NgFor, MatButton, MatInputModule, MatFormFieldModule, MatDatepickerModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  centres: Center[] = [];  // Liste complète des centres
  filteredCentres: Center[] = [];  // Résultats filtrés
  searchTerm: string = '';  // Terme de recherche
  selectedCentre?: Center;  // Centre sélectionné

  // Champs pour le formulaire
  vaccination: Vaccination = {
    centre: { id: 0 },
    mail: '',
    phoneNumber: '',
    last_name: '',
    first_name: '',
    date: new Date().toISOString(),
    isVaccined: false
  };

  constructor(private vaccinationCenterService: CenterService, private vaccinationService: VaccinationService) { }

  ngOnInit(): void {
    this.loadCentres();  // Charger les centres dès l'initialisation
  }

  loadCentres(): void {
    this.vaccinationCenterService.getVaccinationCenters().subscribe((data) => {
      this.centres = data;
      this.filteredCentres = data;  // Initialement, tous les centres sont affichés
    });
  }

  filterCentres(): void {
    const term = this.searchTerm.toLowerCase();
    if (term.trim()) {
      this.filteredCentres = this.centres.filter((centre) => 
        centre.city.toLowerCase().includes(term)
      );
    } else {
      this.filteredCentres = this.centres;  // Si pas de recherche, afficher tous les centres
    }
  }

  chooseCentre(center: Center): void {
    this.selectedCentre = center;
    // Assignation de l'id du centre dans le formulaire
    this.vaccination.centre.id = center.id;
  }

  onDateSelection(event: MatDatepickerInputEvent<Date>) {
    // Add one day to the selected date to match the date format
    var year = event.value?.getFullYear();
    var month = event.value?.getMonth();
    var day = event.value?.getDate();
    day = day! + 1;
    this.vaccination.date = year + '-' + month + '-' + day;
  }

  submitAppointment(): void {


    this.vaccination.date = new Date(this.vaccination.date).toISOString().split('T')[0];

    console.log(this.vaccination);
    this.vaccinationService.postVaccination(this.vaccination).subscribe((data) => {
      console.log(data);
    });
  }
}
