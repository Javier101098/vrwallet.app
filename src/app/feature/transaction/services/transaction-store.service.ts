import {Transaction, TransactionResponse} from '../interfaces/transaction.interface';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {Observable, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {TransactionService} from './transaction.service';
import {TransactionFilterRequest} from '../interfaces/transaction-filter.interface';
import {Paged} from '@core/Interfaces/paged.interface';

interface TransactionState {
  transactions: TransactionResponse[];
  isLoading: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
};

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({

  })),
  withMethods((
    store,
    transactionService =  inject(TransactionService)
  )=> ({
    loadTransactions: rxMethod<TransactionFilterRequest>(
      pipe(
        switchMap((filter: TransactionFilterRequest): Observable<Paged<TransactionResponse>> => {
          return transactionService.get(filter).pipe(
            tap(console.log),
            tapResponse({
              next: (response: Paged<TransactionResponse>) => {
                patchState(store, {
                  transactions: response.items,
                  isLoading: false,
                });
              },
              error: () => {
                patchState(store, {
                  isLoading: false
                });
              }
            })
          );
        })
      )
    )
  }))
)
