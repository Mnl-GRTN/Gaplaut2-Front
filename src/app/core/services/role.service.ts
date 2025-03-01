import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Center } from './center';  // Importation de la classe Center


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = "/private/api/roles";

  constructor(private http: HttpClient) { }

  // GET request to fetch roles
  getRoles(authHeader: string): Observable<Center[]> { // Observable pour gérer les requêtes asynchrones
    const headers = new HttpHeaders({
        'Authorization': authHeader // Add Basic Auth header
      });
    return this.http.get<Center[]>(this.apiUrl, { headers });
  }
}
