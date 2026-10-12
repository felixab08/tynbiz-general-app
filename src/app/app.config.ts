import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { authInterceptor } from './auth/interceptor/auth.interceptor';
import { isLoginInterceptor } from './auth/interceptor/token.interceptor';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools';
import { environment } from '@environments/environment';
import { confirmDeleteInterceptor } from './auth/interceptor/http-confirm-delete.interceptor';
import { AuthService } from './auth/services/auth.service';

registerLocaleData(localEs, 'es', 'es-ES');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-ES',
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // loggingInterceptor,
        isLoginInterceptor,
        authInterceptor,
        confirmDeleteInterceptor,
      ]),
    ),
    provideTanStackQuery(
      new QueryClient(),
      withDevtools(() => ({ loadDevtools: environment.loadDevtools })),
    ),
    /**
     * Restaura la sesión **antes** de que arranque el router.
     *
     * Como `localStorage` solo guarda el `refreshToken`, un F5 obliga a canjearlo
     * por un `accessToken` nuevo contra `/auth/refresh`. Hacerlo aquí, y no en
     * cada guard, evita un round-trip por navegación y garantiza que los guards
     * solo tengan que leer signals.
     */
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.bootstrapSession();
    }),
  ],
};
