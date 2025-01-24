import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VaccinationCenter } from '../vaccination-center';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VaccinationService } from '../vaccination.service';

@Component({
  selector: 'app-vaccination-center',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './vaccination-center.component.html',
  styleUrl: './vaccination-center.component.scss'
})

export class VaccinationCenterComponent {

  @Input() center?: VaccinationCenter;

  @Output() deleted = new EventEmitter<VaccinationCenter>();

  constructor(private activatedRoute: ActivatedRoute, private VaccinationService: VaccinationService) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.center = this.VaccinationService.getCenterById(parseInt(id));
  }

  clearName() {
      this.center!.name = '';
  }

  delete(){
    this.deleted.emit(this.center);
  }
}
