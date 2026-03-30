import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Account } from '../interfaces/account.interface';
import { Observable } from 'rxjs';
import { AccountCreate } from '../interfaces/account-create.interface';
import { Transaction } from '../../transaction/interfaces/transaction.interface';
import { AccountBalanceComparison } from '../interfaces/account-balance-comparison.interface';
import { AccountBalance } from '../interfaces/account-balance.interface';

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

  public getById(id: string) {
    return this.http.get<Account>(`${this.baseUrl}/account/${id}`);
  }

  public getTransactions(id: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/account/${id}/transactions`,
    );
  }

  public getMonthlySummary(id: string) {
    return this.http.get<AccountBalanceComparison>(
      `${this.baseUrl}/account/${id}/monthly-balance`,
    );
  }

  public getDailyBalance(
    id: string,
    startDate: string,
  ): Observable<AccountBalance[]> {
    const params = new HttpParams().set('date', startDate);
    return this.http.get<AccountBalance[]>(
      `${this.baseUrl}/account/${id}/daily-balance`,
      { params },
    );
  }
}
