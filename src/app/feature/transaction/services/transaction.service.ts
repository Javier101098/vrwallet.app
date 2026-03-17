import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Income, Expense, Transfer} from '../interfaces/deposit.interface';
import { Transaction } from '../interfaces/transaction.interface';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  public add(deposit: Income) {
    return this.http
      .post<Transaction>(`${this.baseUrl}/transactions/deposit`, deposit);
  }
  
  public expense(expense:Expense) : Observable<Transaction>{
    return this.http.post<Transaction>
    (`${this.baseUrl}/transactions/withdraw`,expense)
  }
  
  public transfer(transfer:Transfer){
    return this.http.post<Transaction>
    (`${this.baseUrl}/transactions/transfer`,transfer)
  }
}
