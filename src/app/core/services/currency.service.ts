import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { ApiResponse } from '@core/Interfaces/api-response.interface';
import { Currency } from '@core/Interfaces/currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  get(): Observable<Currency[]> {
    return this.http
      .get<ApiResponse<Currency[]>>(`${this.baseUrl}/currency`)
      .pipe(
        distinctUntilChanged(),
        map((res) => res.data),
      );
  }
}
