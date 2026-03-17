import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Account } from '../interfaces/account.interface';
import { Observable } from 'rxjs';
import { AccountCreate } from '../interfaces/account-create.interface';
import { Transaction } from '../../transaction/interfaces/transaction.interface';
import {AccountBalanceComparison} from "../interfaces/account-balance-comparison.interface";

@Injectable({
  providedIn: 'root',
})
// todo: interceptor para poder mapear el resultado
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  public getAccounts(): Observable<Account[]> {
    return this.http
      .get<Account[]>(`${this.baseUrl}/account`)
  }

  public add(account: AccountCreate): Observable<Account> {
    return this.http
      .post<Account>(`${this.baseUrl}/account`, account);
  }

  public getById(id: string) {
    return this.http
      .get<Account>(`${this.baseUrl}/account/${id}`);
  }

  public getTransactions(id: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/account/${id}/transactions`)
  }
  
  public getMonthlySummary(id: string){
    return this.http.get<AccountBalanceComparison>(`${this.baseUrl}/account/${id}/monthly-balance`);
  }
}
