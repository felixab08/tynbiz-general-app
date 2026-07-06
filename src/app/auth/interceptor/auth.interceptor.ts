import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  // Inject the current `AuthService` and get the token value (if any).
  const authService = inject(AuthService);
  const authToken = authService.token();

  // Si no hay token, o si la solicitud se dirige a Cloudflare R2 (externo), no envíe el token 'Bearer'.
  if (!authToken || req.url.includes(environment.CLOUDINARY_URL)) {
    return next(req);
  }

  // Clone the request to add the authentication header when token exists.
  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(newReq);
}
