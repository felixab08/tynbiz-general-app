import { Routes } from '@angular/router';
import { isAdminGuard } from './auth/guards/is-admin.guard';
import { isAutenticatedGuard } from './auth/guards/is-autenticated.guard';
import { isOwnerGuard } from './auth/guards/is-owner.guard';

export const routes: Routes = [
  {
    path: 'shop',
    loadChildren: () =>
      import('./pages/shopper/shopper.routes').then((m) => m.shopperRoutes),
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component'),
    canMatch: [isAutenticatedGuard],
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
    /**
     * Antes solo exigía `isAutenticatedGuard`, así que **cualquier** usuario
     * autenticado (incluso un `CLIENT`) podía entrar a la consola de
     * administración. `isAdminGuard` estaba escrito pero nunca aplicado.
     */
    canMatch: [isAutenticatedGuard, isAdminGuard],
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./pages/stores/stores.routes').then((m) => m.storesRoutes),
    /** Ídem: la consola de tienda es solo para `STORE_OWNER`. */
    canMatch: [isAutenticatedGuard, isOwnerGuard],
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
