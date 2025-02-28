import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../../core/services/auth.service';

import { CenterService } from '../../../core/services/center.service';
import { Center } from '../../../core/services/center';

import { EditCentreFormComponent } from '../edit-centre-form/edit-centre-form.component';

@Component({
  selector: 'app-centres-panel',
  standalone: true,
  imports: [NgFor, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatToolbarModule, EditCentreFormComponent, NgIf],
  templateUrl: './centres-panel.component.html',
  styleUrl: './centres-panel.component.scss'
})

export class CentresPanelComponent implements OnInit {
  centres: Center[] = [];
  filteredCentres: Center[] = [];
  searchTerm: string = '';
  selectedCentre: Center | undefined;

  constructor(
    private centerService: CenterService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCentres();
  }

  fetchCentres(): void {
    this.centerService.getVaccinationCenters().subscribe(
      (data) => {
        this.centres = data;
        this.filteredCentres = data;
      },
      (error) => {
        console.error('Error fetching centres:', error);
      }
    );
  }

  filterCentres(): void {
    this.filteredCentres = this.centres.filter(centre =>
      centre.centreName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      centre.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      centre.postalCode.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Open the edit form for a centre
  editCentre(centre: Center): void {
    this.selectedCentre = centre;
  }

  // Handle save event from the edit form
  saveCentre(updatedCentre: Center): void {
    this.selectedCentre = undefined; // Close the edit form
    this.fetchCentres(); // Refresh the list of centres
  }

  // Handle cancel event from the edit form
  cancelEdit(): void {
    this.selectedCentre = undefined; // Close the edit form
    this.fetchCentres(); // Refresh the list of centres
  }

  manageMedecins(Centre : Center): void {
    console.log('Manage medecins');
  }
}