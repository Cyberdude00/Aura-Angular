// Service for Contact management
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = 'https://www.aurascouting.com/send_email.php';

  constructor(private http: HttpClient) {}

  sendEmail(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}