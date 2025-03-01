import { Component, ViewChild } from '@angular/core';
import { SearchCenterComponent } from '../../components/search-center/search-center.component';
import { InfoCardComponent } from "../../components/info-card/info-card.component";
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { Center } from '../../../core/services/center';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchCenterComponent, InfoCardComponent, AppointmentFormComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild(AppointmentFormComponent) appointmentFormComponent!: AppointmentFormComponent;
  selectedCentre?: Center;

  onCentreSelected(centre: Center): void {
    this.selectedCentre = centre;
    const homepage = document.querySelector('.homepage');
    homepage?.classList.add('appointment-active');

    if (this.appointmentFormComponent) {
      this.appointmentFormComponent.resetAppointmentForm();
    }

  }

  onBackToSearch() {
    const homepage = document.querySelector('.homepage');
    homepage?.classList.remove('appointment-active');
  }
}
