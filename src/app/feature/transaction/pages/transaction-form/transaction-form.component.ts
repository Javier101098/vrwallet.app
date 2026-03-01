import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { InputNumberModule } from 'primeng/inputnumber';
import {AccountStore} from "../../../account/services/account-store.service";
import { SelectButtonModule } from 'primeng/selectbutton';
import {TransactionService} from "../../services/transaction.service";
import {Deposit} from "../../interfaces/deposit.interface";
import {Transaction} from "../../interfaces/transaction.interface";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-transaction-form',
  imports: [
    FormsModule,
    InputNumberModule,
    SelectButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './transaction-form.component.html',
  styles: ``,
})
export default class TransactionFormComponent {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private messageService = inject(MessageService);
  
  accountStore = inject(AccountStore);

  form = this.fb.group({
    accountId: ['',Validators.required],
    categoryId: [null,],
    amount: [0,Validators.required],
    date: ['',Validators.required],
    note: [''],
    payer: [''],
  })
  
  stateOptions: any[] = [
    { label: 'Income', value: 'income' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Transfer', value: 'transfer' },
  ];
  
  
  get currentDeposit(): Deposit {
    return this.form.value as Deposit;
  }
  
  handleSubmit(): void {
    if (this.form.invalid)
      return;
    
    this.transactionService.add(this.currentDeposit)
      .subscribe({
        next:(transaction: Transaction)=>{
          this.messageService.add({
            severity: 'success',
            detail: 'El deposito se ha llevado acabo con exito.'
          });
        },
        error:()=>{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo problemas al depositar a la cuenta'
          });
        }
      })
  }
}
