import { Routes } from '@angular/router';
import { isAutenticatedGuard } from '@app/auth/guards/is-autenticated.guard';

export const shopperRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shopper.component'),
    children: [
      {
        path: 'jitsi/:idContenido',
        loadComponent: () => import('./jitsi/jitsi.page'),
      },
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
        canMatch: [isAutenticatedGuard],
      },
      {
        path: 'offer',
        loadComponent: () => import('./offer/offer.component'),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component'),
      },
      {
        path: 'your-creation',
        loadComponent: () => import('./yourcreation/yourcreation'),
        canMatch: [isAutenticatedGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./../../shared/register-page/register-page'),
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
