import { Routes } from '@angular/router';
import { isAdminGuard } from './auth/guards/is-admin.guard';
import { isAutenticatedGuard } from './auth/guards/is-autenticated.guard';

export const routes: Routes = [
  {
    path: 'shop',
    loadChildren: () =>
      import('./pages/shopper/shopper.routes').then((m) => m.shopperRoutes),
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component'),
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./pages/account/confirmation/confirmation.component'),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.routes').then((m) => m.userRoutes),
    canMatch: [isAutenticatedGuard, isAdminGuard],
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./pages/stores/stores.routes').then((m) => m.storesRoutes),
    canMatch: [isAutenticatedGuard],
  },
  {
    path: 'auth/verify-email',
    loadComponent: () =>
      import('./shared/verification/verification').then((m) => m.Verification),
  },
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
];
