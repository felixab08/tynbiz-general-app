import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas de administración. Acepta `ADMIN` y `SUPER-ADMIN`
 * (igualdad estricta sobre la unión `UserRole`, no `includes()`).
 *
 * Predicado puro: no muta estado ni navega. Devuelve `true`/`false` y deja que
 * el router redirija, en lugar de devolver un `UrlTree` desde `canMatch` (esa
 * combinación encadenaba `NavigationCancelingError`).
 */
export const isAdminGuard: CanMatchFn = () => inject(AuthService).isAdmin();
