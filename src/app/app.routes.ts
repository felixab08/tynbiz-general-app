import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component'),
  },
  {
    path: 'shopper',
    loadChildren: () =>
      import('./pages/shopper/shopper.routes').then((m) => m.shopperRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.routes').then((m) => m.userRoutes),
  },
  {
    path: '',
    redirectTo: 'shopper',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'shopper',
    pathMatch: 'full',
  },
];
