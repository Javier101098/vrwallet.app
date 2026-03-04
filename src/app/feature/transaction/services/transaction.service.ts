import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Deposit } from '../interfaces/deposit.interface';
import { Transaction } from '../interfaces/transaction.interface';
import { ApiResponse } from '@core/Interfaces/api-response.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  public add(deposit: Deposit) {
    return this.http
      .post<
        ApiResponse<Transaction>
      >(`${this.baseUrl}/transactions/deposit`, deposit)
      .pipe(map((res) => res.data));
  }
}
