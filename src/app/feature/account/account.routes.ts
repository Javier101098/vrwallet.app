import { Routes } from '@angular/router';

export default [
  {
    path: '',
    title: 'accounts | vrwallet',
    loadComponent: () =>
      import('./pages/account-shell/account-shell.component'),
  },
  {
    path: 'create',
    title: 'create account | vrwallet',
    loadComponent: () => import('./pages/account-form/account-form.component'),
  },
  {
    path: ':id',
    title: 'account detail | vrwallet',
    loadComponent: () =>
      import('./pages/account-detail/account-detail.component'),
  },
] as Routes;
