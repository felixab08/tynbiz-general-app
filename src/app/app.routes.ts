import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'offer',
    loadComponent: () => import('./pages/offer/offer.component'),
  },
];
