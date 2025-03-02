import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { CenterService } from '../../../core/services/center.service';

import { Center } from '../../../core/services/center';

@Component({
  selector: 'app-search-center',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ FormsModule, NgFor, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatAutocompleteModule, MatIconModule ],
  templateUrl: './search-center.component.html',
  styleUrls: ['./search-center.component.scss']
})
export class SearchCenterComponent implements OnInit {

  centres: Center[] = [];
  filteredCentres: Center[] = [];
  searchTerm: string = '';

  @Output() centreSelected = new EventEmitter<Center>();

  constructor(private vaccinationCenterService: CenterService) {}

  ngOnInit(): void {
    this.loadCentres();
  }

  loadCentres(): void {
    this.vaccinationCenterService.getVaccinationCenters().subscribe((data) => {
      this.centres = data;
      this.filteredCentres = data;
    });
  }

  filterCentres(): void {
    const term = this.searchTerm.toLowerCase();
    if (term.trim()) {
      this.filteredCentres = this.centres.filter((centre) =>
        centre.city.toLowerCase().includes(term)
      );
    } else {
      this.filteredCentres = this.centres;
    }
  }

  chooseCentre(centre: Center): void {
    this.centreSelected.emit(centre);
  }
}