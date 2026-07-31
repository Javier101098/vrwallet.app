import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent:()=>
      import('./pages/transaction-log/transaction-log.component')
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/transaction-form/transaction-form.component'),
  }
] as Routes;
