import { inject, Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '@env/environment';
import { Income, Expense, Transfer } from '../interfaces/deposit.interface';
import {Transaction, TransactionResponse} from '../interfaces/transaction.interface';
import { Observable } from 'rxjs';
import {TransactionFilterRequest} from '../interfaces/transaction-filter.interface';
import {Paged} from '@core/Interfaces/paged.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  public get( filter  : TransactionFilterRequest) : Observable<Paged<TransactionResponse>>{
    let params =  new HttpParams();

    Object.entries(filter).forEach(([key, value]) => {
      if(value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<Paged<TransactionResponse>>(`${this.baseUrl}/transactions`, { params });
  }

  public add(deposit: Income) {
    return this.http.post<Transaction>(
      `${this.baseUrl}/transactions/deposit`,
      deposit,
    );
  }

  public expense(expense: Expense): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.baseUrl}/transactions/withdraw`,
      expense,
    );
  }

  public transfer(transfer: Transfer) {
    return this.http.post<Transaction>(
      `${this.baseUrl}/transactions/transfer`,
      transfer,
    );
  }
}
