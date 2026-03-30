import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountTypeService } from '@core/services/account-type.service';
import { CurrencyService } from '@core/services/currency.service';
import { InstitutionService } from '@core/services/institution.service';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { MessageService } from 'primeng/api';
import { AccountCreate } from '../../interfaces/account-create.interface';
import { AccountStore } from '../../services/account-store.service';
import { Router} from '@angular/router';
import { ColorPickerModule } from 'primeng/colorpicker';
import { of} from "rxjs";
import {AccountService} from "../../services/account.service";
import {Account} from "../../interfaces/account.interface";
import {ProgressSpinner} from "primeng/progressspinner";
import {Select} from "primeng/select";
import {NotFoundComponent} from "@shared/components/not-found/not-found.component";

@Component({
  selector: 'vrw-account-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ColorPickerModule,
    ProgressSpinner,
    Select,
    NotFoundComponent,
  ],
  providers: [MessageService],
  templateUrl: './account-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountFormComponent {
  id = input<string>(); 
    
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private accountTypeService = inject(AccountTypeService);
  private currencyService = inject(CurrencyService);
  private institutionService = inject(InstitutionService);
  private accountStore = inject(AccountStore);
  private messageService = inject(MessageService);
  private router = inject(Router);

  isLoading = this.accountStore.isLoading;
  isEdit = computed(()=>this.id() != undefined)
  
  accountTypes = toSignal(this.accountTypeService.get(), { initialValue: [] });
  currencies = toSignal(this.currencyService.get(), { initialValue: [] });
  institutions = toSignal(this.institutionService.get(), { initialValue: [] });
  
  accountResource = rxResource({
    params:()=> ({id:this.id()}),
    stream:({params}) =>{
      const {id} = params;
      if (id == undefined) return of(null);
      return this.accountService.getById(id);
    }
  })
  
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    accountTypeId: ['', [Validators.required]],
    currencyId: ['', [Validators.required]],
    institutionId: ['', [Validators.required]],
    color: ['#ff0066', [Validators.required]],
  });

  get currentForm(): AccountCreate {
    return this.form.value as AccountCreate;
  }
  
  constructor() {
    effect(() => {
      const account = this.accountResource.value();
      const accountTypes = this.accountTypes();
      const currencies = this.currencies();
      const institutions = this.institutions();

      const allLoaded =
        account &&
        accountTypes.length > 0 &&
        currencies.length > 0 &&
        institutions.length > 0;

      if (allLoaded) {
        this.form.patchValue(account as Account);
      }
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor complete todos los campos requeridos.',
      });
      return;
    }
    
    this.isEdit() && this.id() != undefined 
      ? this.accountStore.updateAccount({
          account:this.currentForm,id:this.id()!
        }) 
      : this.accountStore.addAccount(this.currentForm);
  }

  handleGoOut(): void {
    this.router.navigate(['/accounts']).then();
  }
}
