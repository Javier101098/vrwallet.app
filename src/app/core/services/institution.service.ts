import { inject, Injectable } from '@angular/core';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { ApiResponse } from '@core/Interfaces/api-response.interface';
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
      .get<ApiResponse<Institution[]>>(`${this.baseUrl}/institution`)
      .pipe(
        distinctUntilChanged(),
        map((res) => res.data),
      );
  }
}
