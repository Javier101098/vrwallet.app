import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { AccountType } from '@core/Interfaces/account-type.interface';
import { environment } from '@env/environment';
import { ApiResponse } from '@core/Interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountTypeService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  get(): Observable<AccountType[]> {
    return this.http
      .get<ApiResponse<AccountType[]>>(`${this.baseUrl}/account-type`)
      .pipe(
        distinctUntilChanged(),
        map((res) => res.data),
      );
  }
}
