import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import {Account} from '../interfaces/account.interface';
import { Observable } from 'rxjs';
import { AccountCreate } from '../interfaces/account-create.interface';
import { Transaction } from '../../transaction/interfaces/transaction.interface';
import { AccountSummary } from '../interfaces/account-summary.interface';
import {BalanceDate} from "@core/Interfaces/balance-date.interface";

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  public getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/account`);
  }

  public add(account: AccountCreate): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/account`, account);
  }
  
  public update(account: AccountCreate,id: string) : Observable<Account>{
    return this.http.put<Account>(`${this.baseUrl}/account/${id}`, account);
  }

  public getById(id: string) : Observable<AccountCreate> {
    return this.http.get<AccountCreate>(`${this.baseUrl}/account/${id}`);
  }

  public getTransactions(id: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/account/${id}/transactions`,
    );
  }

  public getSummary(id: string) {
    return this.http.get<AccountSummary>(
      `${this.baseUrl}/account/${id}/summary`,
    );
  }

  public getBalanceHistory(
    id: string,
    startDate: string,
  ): Observable<BalanceDate[]> {
    const params = new HttpParams().set('date', startDate);
    return this.http.get<BalanceDate[]>(
      `${this.baseUrl}/account/${id}/daily-balance`,
      { params },
    );
  }
}
