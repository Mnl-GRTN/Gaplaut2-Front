import { Injectable } from '@angular/core';
import { VaccinationCenter } from './vaccination-center';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {

  constructor() { }
  CENTERS: VaccinationCenter[] = [
    {
      id: 2,
      name: 'Messehalle 1',
      address: 'Messeplatz 1',
      postalCode: '20357',
      city: 'Hamburg',
      openingDate: new Date("2021-01-01")
    },
    {
      id: 3,
      name: 'Impfzentrum Berlin',
      address: 'Messeplatz 1',
      postalCode: '20357',
      city: 'Berlin',
      openingDate: new Date("2021-01-01")
    },
    {
      id: 4,
      name: 'Impfzentrum München',
      address: 'Messeplatz 1',
      postalCode: '20357',
      city: 'München',
      openingDate: new Date("2021-01-01")
    },
    {
      id: 5,
      name: 'Impfzentrum Köln',
      address: 'Messeplatz 1',
      postalCode: '20357',
      city: 'Köln',
      openingDate: new Date("2021-01-01")
    }
  ]

  getAllVaccinationCenter(): VaccinationCenter[] {
    return this.CENTERS;
  }

  getCenterById(id: number): VaccinationCenter {
    return this.CENTERS.find(center => center.id === id)!;
  }
}
