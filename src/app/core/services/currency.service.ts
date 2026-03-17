import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Currency } from '@core/Interfaces/currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  get(): Observable<Currency[]> {
    return this.http
      .get<Currency[]>(`${this.baseUrl}/currency`);
  }
}
