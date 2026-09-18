import { Routes } from '@angular/router';

export default [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.component').then(
        (m) => m.SignInComponent,
      ),
    title: 'vrwallet | Sign In',
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.component'),
    title: 'vrwallet | Sign Up',
  },
  {
    path: '**',
    redirectTo: 'sign-in',
  },
] as Routes;
