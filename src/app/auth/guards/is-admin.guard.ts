import { inject } from '@angular/core';
import type { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  await firstValueFrom(authService.checkStatus());
  return authService.isAdmin();
};
