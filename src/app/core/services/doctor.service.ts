import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from './doctor'; // Import the Doctor interface
import { catchError } from 'rxjs/operators';  // Importe catchError
import { throwError } from 'rxjs';  // Importer throwError pour renvoyer une erreur

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'private/api/doctors/centre';

  constructor(private http: HttpClient) { }

  // Fetch doctors for a specific centre
  getDoctorsByCentre(centreId: number, authHeader: string): Observable<Doctor[]> {
    const headers = new HttpHeaders({
      'Authorization': authHeader // Add Basic Auth header
    });

    const url = `${this.apiUrl}/${centreId}`; // Construct the URL with the centre ID
    return this.http.get<Doctor[]>(url, { headers });
  }

  getDoctors(authHeader: string): Observable<Doctor[]> {
    const headers = new HttpHeaders({
      'Authorization': authHeader // Add Basic Auth header
    });

    return this.http.get<Doctor[]>('private/api/doctors', { headers });
  }

  removeDoctorById(doctorId: number, authHeader: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': authHeader // Add Basic Auth header
    });

    const url = `private/api/doctor/${doctorId}`; // Construct the URL with the doctor ID
    return this.http.delete(url, { headers });
  }

  updateDoctorById(doctorId: number, doctor: Doctor, authHeader: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': authHeader // Add Basic Auth header
    });

    const url = `private/api/doctor/${doctorId}`; // Construct the URL with the doctor ID
    return this.http.put(url, doctor, { headers }).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error || 'Error updating doctor'));
      })
    );
  }

  addDoctor(doctor: Doctor, authHeader: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader // Add Basic Auth header
    });

    return this.http.post('private/api/doctors', doctor, { headers }).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error || 'Error adding doctor'));
      })
    );
  }

}