import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component'),
    children: [
      {
        path: 'panel',
        loadComponent: () => import('./panel-page/panel-page.component'),
      },
      {
        path: 'politic',
        loadComponent: () => import('./politic-page/politic-page.component'),
      },
      {
        path: 'request-demo',
        loadComponent: () =>
          import('./request-demo-page/request-demo-page.component'),
      },
      {
        path: 'request-service',
        loadComponent: () =>
          import('./request-service-page/request-service-page.component'),
      },
      {
        path: 'planes-suscription',
        loadComponent: () =>
          import('./planes-suscription-page/planes-suscription-page.component'),
      },
      {
        path: 'plan-suscript',
        loadComponent: () =>
          import('./plan-suscrip-page/plan-suscrip-page.component'),
      },
      {
        path: 'list-user-admin',
        loadComponent: () =>
          import('./list-user-admin-page/list-user-admin-page.component'),
      },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('./user-detail-page/user-detail-page.component'),
      },
      {
        path: 'list-role',
        loadComponent: () =>
          import('./list-role-page/list-role-page.component'),
      },
      {
        path: 'list-actions-user',
        loadComponent: () =>
          import('./list-actions-user-page/list-actions-user-page.component'),
      },
      {
        path: 'list-store',
        loadComponent: () =>
          import('./list-store-page/list-store-page.component'),
      },
      {
        path: 'revenue',
        loadComponent: () => import('./revenue-page/revenue-page.component'),
      },
      {
        path: 'statistic',
        loadComponent: () =>
          import('./statistic-page/statistic-page.component'),
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment-page/payment-page.component'),
      },
      {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'panel',
        pathMatch: 'full',
      },
    ],
  },
];
