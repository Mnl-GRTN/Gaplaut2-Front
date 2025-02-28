import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Center } from './center';  // Importation de la classe Center


@Injectable({
  providedIn: 'root'
})
export class CenterService {

  private publicApiUrl = 'public/api/centres';
  private privateApiUrl = 'private/api/centres';

  constructor(private http: HttpClient) { }

  // GET request to fetch vaccination centers
  getVaccinationCenters(): Observable<Center[]> { // Observable pour gérer les requêtes asynchrones
    return this.http.get<Center[]>(this.publicApiUrl);
  }

  // PUT request to update a vaccination center
  updateCentre(id: number, centre: Center, authHeader: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${authHeader}` // Add Basic Auth header
    });

    const url = `${this.privateApiUrl}/${id}`; // Construct the URL with the centre ID
    return this.http.put(url, centre, { headers });
  }
}
