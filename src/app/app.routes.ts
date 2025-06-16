import { Routes } from '@angular/router';

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
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.routes').then((m) => m.userRoutes),
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./pages/stores/stores.routes').then((m) => m.storesRoutes),
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
