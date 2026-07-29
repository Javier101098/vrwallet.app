import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {Observable, pipe, switchMap, tap} from 'rxjs';

import { TransactionResponse } from '../interfaces/transaction.interface';
import { TransactionFilterRequest } from '../interfaces/transaction-filter.interface';
import { Paged } from '@core/Interfaces/paged.interface';
import { TransactionService } from './transaction.service';

interface TransactionState {
  data: Paged<TransactionResponse> | null;
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilterRequest | null;
}

const initialState: TransactionState = {
  data: null,
  isLoading: false,
  error: null,
  filters: null,
};

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isEmpty: computed(() => !store.isLoading() && store.data()?.totalCount === 0),
    pages : computed(() => Array.from({ length: store.data()?.totalPages ?? 0 }, (_, i) => i + 1))
  })),
  withMethods((store, transactionService = inject(TransactionService)) => ({
    loadTransactions: rxMethod<TransactionFilterRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((filter: TransactionFilterRequest) : Observable<Paged<TransactionResponse>> => {
          return transactionService.get(filter).pipe(
            tapResponse({
              next: (response: Paged<TransactionResponse>) => {
                patchState(store, {
                  data: response,
                  isLoading: false,
                  filters: filter,
                });
              },
              error: () => {
                patchState(store, {
                  ...initialState,
                  isLoading: false,
                  error: 'No se pudo cargar el listado de transacciones.',
                });
              },
            })
          );
        })
      )
    ),
  }))
);
