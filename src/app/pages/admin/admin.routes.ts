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
