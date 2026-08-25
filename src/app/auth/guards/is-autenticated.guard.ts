import { inject } from '@angular/core';
import type { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MenuService } from '../services/menu.service';

export const isAutenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  if (isAuthenticated) {
    return true;
  }
  return false;
};
