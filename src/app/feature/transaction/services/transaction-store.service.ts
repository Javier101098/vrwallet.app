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
  transactions: TransactionResponse[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
};

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    hasNextPage: computed(() => store.pageNumber() < store.totalPages()),
    hasPreviousPage: computed(() => store.pageNumber() > 1),
    isEmpty: computed(() => !store.isLoading() && store.transactions().length === 0),
    pages : computed(() => Array.from({ length: store.totalPages() }, (_, i) => i + 1))
  })),
  withMethods((store, transactionService = inject(TransactionService)) => ({
    loadTransactions: rxMethod<TransactionFilterRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((filter: TransactionFilterRequest) : Observable<Paged<TransactionResponse>> =>
          transactionService.get(filter).pipe(
            tapResponse({
              next: ({ items, ...response }: Paged<TransactionResponse>) => {
                patchState(store, {
                  ...response,
                  transactions: items,
                  isLoading: false,
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
          )
        )
      )
    ),
  }))
);
