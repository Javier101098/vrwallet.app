import {Account} from "../interfaces/account.interface";
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {distinctUntilChanged, pipe, switchMap, tap} from "rxjs";
import {inject} from "@angular/core";
import {AccountService} from "./account.service";
import { tapResponse } from '@ngrx/operators';

type AccountState = {
  accounts: Account[];
  isLoading: boolean;
}

const initialState: AccountState = {
  accounts: [],
  isLoading: false,
};

export const AccountStore = signalStore(
  withState(initialState),
  withComputed((store)=>({
    balance:() => {
      return store.accounts().reduce(
        (acc, account) => acc + account.balance, 0
      )
    }
  })),
  withMethods((store, accountService = inject(AccountService))=>({
    loadAccounts: rxMethod<void>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap(()=>{
          return accountService.getAccounts().pipe(
            tapResponse({
              next: (accounts: Account[]) => {
                patchState(store, {accounts,isLoading: false});
              },
              error: () => {
                patchState(store, {isLoading: false});
              }
            })
          ); 
        })
      )
    )
  })),
  withHooks({
    onInit: (store) => {
      store.loadAccounts()
    }
  })
)