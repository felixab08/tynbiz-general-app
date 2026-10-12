import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * El refresh de sesión se resuelve **una vez** en el arranque de la app
 * (`provideAppInitializer` + `AuthService.bootstrapSession()`), por lo que este
 * guard solo lee signals: sin red en el camino de navegación.
 *
 * Es un predicado puro: no muta estado ni navega. Hacerlo provocaba
 * `NavigationCancelingError` en cadena, porque `clearSession()` empuja a
 * `StoreService` en mitad de la resolución de la ruta.
 */
export const isAutenticatedGuard: CanMatchFn = () =>
  inject(AuthService).isAuthenticated();
