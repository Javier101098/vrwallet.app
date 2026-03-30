import { Account } from '../interfaces/account.interface';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { AccountService } from './account.service';
import { tapResponse } from '@ngrx/operators';
import { AccountCreate } from '../interfaces/account-create.interface';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface AccountState {
  accounts: Account[];
  isLoading: boolean;
}

const initialState: AccountState = {
  accounts: [],
  isLoading: false,
};

export const AccountStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    balance: () : number  => {
      return store
        .accounts()
        .reduce((acc, account) => acc + account.balance, 0);
    },
    count:() : number =>{
      return store.accounts().length;
    }
  })),
  withMethods(
    (
      store,
      accountService = inject(AccountService),
      messageService = inject(MessageService),
      router = inject(Router),
    ) => ({
      loadAccounts: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => {
            return accountService.getAccounts().pipe(
              tapResponse({
                next: (accounts: Account[]) => {
                  patchState(store, { accounts, isLoading: false });
                },
                error: () => {
                  patchState(store, { isLoading: false });
                },
              }),
            );
          }),
        ),
      ),
      addAccount: rxMethod<AccountCreate>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((account) => {
            return accountService.add(account).pipe(
              tapResponse({
                next: (newAccount: Account) => {
                  patchState(store, (state) => ({
                    accounts: [...state.accounts, newAccount],
                    isLoading: false,
                  }));

                  messageService.add({
                    severity: 'success',
                    detail: 'Cuenta creada correctamente',
                  });

                  router.navigate(['/accounts']).then();
                },
                error: (error: HttpErrorResponse) => {
                  const message = error.error.errors
                    ? Object.values(error.error.errors).find((x) =>
                        Array.isArray(x),
                      )?.[0]
                    : 'Hubo un problema al crear la cuenta, intente nuevamente.';

                  messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: message,
                  });

                  patchState(store, { isLoading: false });
                },
              }),
            );
          }),
        ),
      ),
      updateAccount: rxMethod<{ account: AccountCreate; id: string }>(
        pipe(
          tap(()=>patchState(store,{isLoading:true})),
          switchMap(({account,id})=>{
            return accountService.update(account,id)
              .pipe(
                tapResponse({
                  next:(updateAccount: Account)=> {
                    patchState(store,(state)=>({
                      accounts: state.accounts.map((account)=>(account.id === updateAccount.id ? updateAccount : account)),
                      isLoading: false
                    }))
                    
                    messageService.add({
                      severity: 'success',
                      detail: 'Cuenta actualizada correctamente',
                    });
                    
                    router.navigate(['/accounts']).then();
                  },
                  error:(error: HttpErrorResponse)=>{
                    const message = error.error.errors
                      ? Object.values(error.error.errors).find((x) =>
                        Array.isArray(x),
                      )?.[0]
                      : 'Hubo un problema al crear la cuenta, intente nuevamente.';

                    messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: message,
                    });

                    patchState(store, { isLoading: false });                  }
                })
              )
          })
        )
      )
    }),
  ),
  withHooks({
    onInit: (store) => {
      store.loadAccounts();
    },
  }),
);
