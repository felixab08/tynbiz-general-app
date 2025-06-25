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
        path: 'products',
        loadComponent: () =>
          import('./products-store-page/products-store-page.component'),
      },
       {
        path: 'contact',
        loadComponent: () =>
          import('./contact-store-page/contact-store-page.component'),
      },
       {
        path: 'creation',
        loadComponent: () =>
          import('./creation-store-page/creation-store-page.component'),
      },
       {
        path: 'client',
        loadComponent: () =>
          import('./client-store-page/client-store-page.component'),
      },
       {
        path: 'info-store',
        loadComponent: () =>
          import('./info-store-page/info-store-page.component'),
      },
       {
        path: 'subscriptions',
        loadComponent: () =>
          import('./suscription-store-page/suscription-store-page.component'),
      },
      {
        path: '',
        redirectTo: 'init-store',
        pathMatch: 'full',
      },
    ],
  },
];
