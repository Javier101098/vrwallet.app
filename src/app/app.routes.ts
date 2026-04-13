import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@core/layouts/main-layout/main-layout.component';
import { DashboardPageComponent } from './feature/dashboard/pages/dashboard-page/dashboard-page.component';
import AuthLayoutComponent from '@core/layouts/auth-layout/auth-layout.component';
import { authenticatedGuard } from '@core/guards/authenticated.guard';
import { noAuthenticatedGuard } from '@core/guards/no-authenticated.guard';
import {FinancialService} from "./feature/dashboard/services/financial.service";

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  {
    path: 'auth',
    title: 'Autenticación | vrwallet',
    canActivate: [noAuthenticatedGuard],
    component: AuthLayoutComponent,
    loadChildren: () => import('./feature/auth/auth.routes'),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authenticatedGuard],
    children: [
      {
        path: '',
        providers: [FinancialService],
        title: 'dashboard | vrwallet',
        component: DashboardPageComponent,
      },
      {
        path: 'accounts',
        loadChildren: () => import('./feature/account/account.routes'),
      },
      {
        path: 'transactions',
        loadChildren: () => import('./feature/transaction/transaction.routes'),
      },
    ],
  },
];
