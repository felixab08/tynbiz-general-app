import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas exclusivas de `CLIENT` (`favorites`, `your-creation`).
 *
 * `isClient()` ya no devuelve `true` para el anónimo: ese caso se expone
 * aparte como `isAnonymous`. Sin sesión, este guard rechaza.
 *
 * Predicado puro: no muta estado ni navega.
 */
export const isClientGuard: CanMatchFn = () => inject(AuthService).isClient();
