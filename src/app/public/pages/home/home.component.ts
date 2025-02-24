import { Component } from '@angular/core';
import { SearchCenterComponent } from '../../components/search-center/search-center.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchCenterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
