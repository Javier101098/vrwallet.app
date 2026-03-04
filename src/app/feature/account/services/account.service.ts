import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Account } from '../interfaces/account.interface';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '@core/Interfaces/api-response.interface';
import { AccountCreate } from '../interfaces/account-create.interface';
import { Transaction } from '../../transaction/interfaces/transaction.interface';

@Injectable({
  providedIn: 'root',
})
// todo: interceptor para poder mapear el resultado
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  public getAccounts(): Observable<Account[]> {
    return this.http
      .get<ApiResponse<Account[]>>(`${this.baseUrl}/account`)
      .pipe(map((res) => res.data));
  }

  public add(account: AccountCreate): Observable<Account> {
    return this.http
      .post<ApiResponse<Account>>(`${this.baseUrl}/account`, account)
      .pipe(map((res) => res.data));
  }

  public getById(id: string) {
    return this.http
      .get<ApiResponse<Account>>(`${this.baseUrl}/account/${id}`)
      .pipe(map((res) => res.data));
  }

  public getTransactions(id: string): Observable<Transaction[]> {
    return this.http
      .get<
        ApiResponse<Transaction[]>
      >(`${this.baseUrl}/account/${id}/transactions`)
      .pipe(map((res) => res.data));
  }
}
