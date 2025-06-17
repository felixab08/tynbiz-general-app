import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component'),
    children: [
      {
        path: '',
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
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
