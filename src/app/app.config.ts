import {
  ApplicationConfig,
  LOCALE_ID,
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
      ])
    ),
  ],
};
