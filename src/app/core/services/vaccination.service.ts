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

    // POST request to create a vaccination appointment
    postVaccinationAppointment(vaccination: Vaccination): Observable<Vaccination> {
        return this.http.post<Vaccination>(this.apiUrl, vaccination);
    }

    // GET request to fetch all vaccination appointments
    getVaccinationAppointments(centerId: number, date: string): Observable<Vaccination[]> {
        const url = `private/api/vaccinations/${centerId}/${date}`;
        return this.http.get<Vaccination[]>(url);
    }

    // PUT request to update (validate) a vaccination appointment
    updateVaccinationAppointment(vaccinationId: number): Observable<any> {
        const url = `private/api/vaccination/validation/${vaccinationId}`;
        return this.http.put(url, {});
    }

}
