import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountType } from '@core/Interfaces/account-type.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountTypeService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  get(): Observable<AccountType[]> {
    return this.http
      .get<AccountType[]>(`${this.baseUrl}/account-type`);
  }
}
