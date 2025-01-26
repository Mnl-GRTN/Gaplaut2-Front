import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Center } from './center';  // Importation de la classe Center

@Injectable({
  providedIn: 'root'
})
export class CenterService {

  private apiUrl = '/api/centres';  // URL de l'API backend

  constructor(private http: HttpClient) { }

  getVaccinationCenters(): Observable<Center[]> { // Observable pour gérer les requêtes asynchrones
    return this.http.get<Center[]>(this.apiUrl);
  }
}
