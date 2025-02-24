import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vaccination } from './vaccination';  // Importation de la classe Center

@Injectable({
  providedIn: 'root'
})

export class VaccinationService {

    private apiUrl = 'public/api/vaccinations';  // URL de l'API backend

    constructor(private http: HttpClient) { }

    postVaccination(vaccination: Vaccination): Observable<Vaccination> {
        return this.http.post<Vaccination>(this.apiUrl, vaccination);
    }

}
