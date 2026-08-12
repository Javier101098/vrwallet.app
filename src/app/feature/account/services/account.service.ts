import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CreateAccountRequest } from '../interfaces/account-create.interface';
import { Transaction } from '../../transaction/interfaces/transaction.interface';
import { AccountSummaryResponse } from '../interfaces/account-summary.interface';
import {BalanceDate} from "@core/Interfaces/balance-date.interface";
import {AccountDetail} from '../interfaces/account-detail.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  public getById(id: string) : Observable<CreateAccountRequest> {
    return this.http.get<CreateAccountRequest>(`${this.baseUrl}/accounts/${id}`);
  }

  public get(): Observable<AccountDetail[]> {
    return this.http.get<AccountDetail[]>(`${this.baseUrl}/accounts`);
  }

  public add(account: CreateAccountRequest): Observable<AccountDetail> {
    return this.http.post<AccountDetail>(`${this.baseUrl}/accounts`, account);
  }

  public update(account: CreateAccountRequest, id: string) : Observable<AccountDetail>{
    return this.http.put<AccountDetail>(`${this.baseUrl}/accounts/${id}`, account);
  }

  public getTransactions(id: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/accounts/${id}/transactions`,
    );
  }

  public getSummary(id: string) {
    return this.http.get<AccountSummaryResponse>(
      `${this.baseUrl}/accounts/${id}/summary`,
    );
  }

  public getBalanceHistory(
    id: string,
    startDate: string,
  ): Observable<BalanceDate[]> {
    const params = new HttpParams().set('date', startDate);
    return this.http.get<BalanceDate[]>(
      `${this.baseUrl}/accounts/${id}/daily-balance`,
      { params },
    );
  }
}
