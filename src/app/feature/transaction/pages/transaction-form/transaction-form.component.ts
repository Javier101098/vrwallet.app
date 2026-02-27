import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import { InputNumberModule } from 'primeng/inputnumber';
import {AccountStore} from "../../../account/services/account-store.service";
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-transaction-form',
  imports: [
    FormsModule,
    InputNumberModule,
    SelectButtonModule
  ],
  providers:[
    AccountStore
  ],
  templateUrl: './transaction-form.component.html',
  styles: ``,
})
export default class TransactionFormComponent {
  accountStore = inject(AccountStore);
  stateOptions: any[] = [
    { label: 'Income', value: 'income' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Transfer', value: 'transfer' },
  ];
}
