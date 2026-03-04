import { Routes } from '@angular/router';

export default [
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/transaction-form/transaction-form.component'),
  },
] as Routes;
