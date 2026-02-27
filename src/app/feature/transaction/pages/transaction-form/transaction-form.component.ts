import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import { InputNumberModule } from 'primeng/inputnumber';
import {AccountStore} from "../../../account/services/account-store.service";

@Component({
  selector: 'app-transaction-form',
  imports: [
    FormsModule,
    InputNumberModule
  ],
  providers:[
    AccountStore
  ],
  templateUrl: './transaction-form.component.html',
  styles: ``,
})
export default class TransactionFormComponent {
  accountStore = inject(AccountStore);
}
