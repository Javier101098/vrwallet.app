import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Institution } from '@core/Interfaces/institution.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  get(): Observable<Institution[]> {
    return this.http
      .get<Institution[]>(`${this.baseUrl}/institution`);
  }
}
