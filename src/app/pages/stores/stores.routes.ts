import { Routes } from '@angular/router';

export const storesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./stores.component'),
    children: [
      {
        path: 'init-store',
        loadComponent: () =>
          import('./init-store-page/init-store-page.component'),
      },
      {
        path: '',
        redirectTo: 'init-store',
        pathMatch: 'full',
      },
    ],
  },
];
