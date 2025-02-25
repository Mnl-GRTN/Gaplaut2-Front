import { Component } from '@angular/core';
import { SearchCenterComponent } from '../../components/search-center/search-center.component';
import { InfoCardComponent } from "../../components/info-card/info-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchCenterComponent, InfoCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
