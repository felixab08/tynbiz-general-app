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
        path: 'list-user',
        loadComponent: () =>
          import('./list-user-page/list-user-page.component'),
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
