import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Maneja los 401.
 *
 * Antes, **cualquier** 401 distinto de `login` ejecutaba
 * `logoutAndReload()`, que borraba la sesión y recargaba la página. Eso:
 *
 * - expulsaba al usuario por un fallo de un endpoint opcional;
 * - provocaba bucles de reload cuando fallaba el propio `/auth/refresh`;
 * - era la causa del "Error al obtener notificaciones no leídas: 401" que
 *   terminaba cerrando sesión.
 *
 * Ahora un 401 intenta **una vez** refrescar el token y reintentar la petición.
 * Solo si el refresh o el reintento vuelven a fallar se cierra la sesión, y sin
 * `location.reload()`.
 */
export function isLoginInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Los endpoints de autenticación gestionan su propio error: un 401 en
      // login es "credenciales incorrectas", no "sesión expirada".
      const lastSegment = req.url.split('?')[0].split('/').pop();
      const isAuthEndpoint =
        lastSegment === 'login' ||
        lastSegment === 'refresh' ||
        lastSegment === 'register-buyer' ||
        lastSegment === 'verify-email';

      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      if (!authService.canRefresh()) {
        // No queda refreshToken: la sesión es irrecuperable.
        authService.clearSession();
        return throwError(() => error);
      }

      return authService.refreshSession().pipe(
        switchMap((token) => {
          if (!token) {
            // El refresh falló y ya limpió la sesión dentro de AuthService.
            return throwError(() => error);
          }
          return next(req);
        }),
        catchError((retryError) => {
          // El reintento volvió a dar 401: la sesión está muerta de verdad.
          if (retryError?.status === 401) {
            authService.clearSession();
          }
          return throwError(() => retryError);
        }),
      );
    }),
  );
}
