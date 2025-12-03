import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // Inject the current `AuthService` and get the token value (if any).
  const authService = inject(AuthService);
  const authToken = authService.token();

  // If there is no token, forward the original request (do not send 'Bearer null').
  if (!authToken) {
    return next(req);
  }

  // Clone the request to add the authentication header when token exists.
  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(newReq);
}
