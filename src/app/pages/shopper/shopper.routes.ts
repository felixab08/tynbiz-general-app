import { Routes } from '@angular/router';

export const shopperRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shopper.component'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component'),
      },
      {
        path: 'stores',
        loadComponent: () => import('./stores/stores.component'),
      },
      {
        path: 'creations',
        loadComponent: () => import('./creations/creations.component'),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites.component'),
      },
      {
        path: 'offer',
        loadComponent: () => import('./offer/offer.component'),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
