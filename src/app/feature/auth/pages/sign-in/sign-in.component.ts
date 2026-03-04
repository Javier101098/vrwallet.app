import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';

@Component({
  selector: 'vrw-sign-in',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './sign-in.component.html',
  standalone: true,
  styles: ``,
})
export class SignInComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  loading = signal<boolean>(false);

  form = this.fb.nonNullable.group({
    // Agregamos .nonNullable
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ),
      ],
    ],
  });

  handleSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Atención',
        detail: 'Verifica los datos ingresados',
      });
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { email, password } = this.form.getRawValue();

    this.authService
      .login(email, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((status) => {
        if (status) {
          this.router.navigate(['/']).then();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Atención',
            detail: 'Verifica los datos ingresados',
          });
        }
      });
  }
}
