import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas del dueño de tienda (`/stores/**`).
 * `/stores` ya exige `isAutenticatedGuard`; este acota el rol.
 *
 * Predicado puro: no muta estado ni navega.
 */
export const isOwnerGuard: CanMatchFn = () => inject(AuthService).isOwner();
