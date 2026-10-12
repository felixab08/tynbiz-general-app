import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import {
  catchError,
  finalize,
  firstValueFrom,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface';
import { StoreService } from '@app/services/store.service';
import { IRegisterReq, IErrorResp } from '@app/interfaces';
import { AlertService } from '@app/services';

const baseUrl = environment.baseUrl;

export type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

/**
 * Estado de sesión.
 *
 * **Persistencia:** en `localStorage` vive **únicamente** `refreshToken`. El
 * `token` de acceso y el `user` son efímeros y se guardan solo en memoria
 * (signals + `StoreService`), de modo que un XSS con acceso a `localStorage`
 * no expone el token de acceso.
 *
 * **Restauración:** al arrancar (`bootstrapSession()`, conectado con
 * `provideAppInitializer`) se llama a `POST /auth/refresh` con el
 * `refreshToken` almacenado. Si responde, se reconstruyen token y user en
 * memoria; si falla, se sigue como anónimo sin romper el arranque.
 *
 * Como el bootstrap bloquea el arranque de la aplicación, **los guards no
 * hacen red**: leen signals.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Única clave persistente de la sesión. */
  static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  /**
   * Claves de la sesión del esquema anterior (token + user en localStorage).
   * Se eliminan en el arranque: mantener el token de acceso persistido
   * contradice el modelo de seguridad de este servicio.
   */
  private static readonly LEGACY_SESSION_KEYS = ['token', 'user'];

  private readonly storeService = inject(StoreService);
  private readonly _alertService = inject(AlertService);
  private readonly http = inject(HttpClient);
  private readonly _router = inject(Router);

  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _status = signal<AuthStatus>('checking');
  private readonly _refreshing = signal(false);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly authStatus = this._status.asReadonly();
  readonly isRefreshing = this._refreshing.asReadonly();

  readonly isAuthenticated = computed(
    () => this._user() !== null && this._token() !== null,
  );

  /** Sin sesión. Se expone aparte para no mezclarlo con `isClient`. */
  readonly isAnonymous = computed(() => this._user() === null);

  readonly isAdmin = computed(() => {
    const role = this._user()?.role;
    return role === 'ADMIN' || role === 'SUPER-ADMIN';
  });

  readonly isOwner = computed(() => this._user()?.role === 'STORE_OWNER');

  readonly isClient = computed(() => this._user()?.role === 'CLIENT');

  /** Roles que operan la plataforma desde una consola (admin o tienda). */
  readonly isConsoleRole = computed(
    () => this.isAdmin() || this.isOwner(),
  );

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        map((data) =>
          this.establishSession(data.user, data.accessToken, data.refreshToken),
        ),
        // Un 401 aquí son credenciales incorrectas: NO se cierra sesión.
        catchError((error: HttpErrorResponse) => this.handleLoginError(error)),
      );
  }

  postRegisterBuyerUser(register: IRegisterReq): Observable<unknown> {
    return this.http.post(`${baseUrl}/auth/register-buyer`, register);
  }

  /**
   * Arranque de la sesión. Lo invoca `provideAppInitializer` en `app.config.ts`
   * antes de que el router resuelva la navegación inicial.
   *
   * @returns `true` si la sesión quedó establecida.
   */
  async bootstrapSession(): Promise<boolean> {
    this.purgeLegacySessionKeys();

    const refreshToken = this.readRefreshToken();
    if (!refreshToken) {
      this._status.set('not-authenticated');
      return false;
    }

    const token = await firstValueFrom(this.refreshSession());
    return token !== null;
  }

  /**
   * Canjea el `refreshToken` por un `accessToken` nuevo y reconstruye la
   * sesión en memoria. Deduplica llamadas concurrentes (dos navegaciones
   * rápidas no deben disparar dos refreshes con el mismo token).
   *
   * @returns el `accessToken` nuevo, o `null` si no se pudo recuperar.
   */
  refreshSession(): Observable<string | null> {
    const refreshToken = this.readRefreshToken();

    if (!refreshToken || this._refreshing()) {
      return of(null);
    }

    this._refreshing.set(true);

    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/refresh`, { refreshToken })
      .pipe(
        map((data) => {
          // El backend puede rotar el refreshToken; si lo devuelve, se persiste.
          const rotated = data.refreshToken ?? refreshToken;
          this.establishSession(data.user, data.accessToken, rotated);
          return data.accessToken;
        }),
        catchError((error: HttpErrorResponse) => {
          // El refresh falló: la sesión no es recuperable.
          console.warn('[auth] refresh rechazado:', error.status);
          this.clearSession();
          return of(null);
        }),
        finalize(() => this._refreshing.set(false)),
      );
  }

  /**
   * ¿Hay con qué reintentar una petición que devolvió 401? Evita el bucle
   * cuando el propio refresh es lo que falló.
   */
  canRefresh(): boolean {
    return !this._refreshing() && this.readRefreshToken() !== null;
  }

  /**
   * Establece la sesión en memoria y persiste **solo** el `refreshToken`.
   * Espeja en `StoreService` porque `JitsiService` (WebSocket) y varios
   * componentes leen de ahí.
   */
  establishSession(user: User, accessToken: string, refreshToken: string): true {
    this._user.set(user);
    this._token.set(accessToken);
    this._status.set('authenticated');

    localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, refreshToken);

    this.storeService.user.next(user);
    this.storeService.tokenSubject.next(accessToken);
    this.storeService.refreshTokenSubject.next(refreshToken);

    return true;
  }

  /**
   * Limpia el estado de sesión **sin navegar**. Seguro de llamar desde guards
   * y desde el interceptor: usar `logout()` ahí provoke navegaciones
   * compitiendo con la que el router ya está resolviendo.
   */
  clearSession(): void {
    this._user.set(null);
    this._token.set(null);
    this._status.set('not-authenticated');

    localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);

    this.storeService.user.next(undefined);
    this.storeService.tokenSubject.next(null);
    this.storeService.refreshTokenSubject.next(null);
    this.storeService.isLoginSubject.next(false);
  }

  /** Limpia y redirige. Para uso del componente de login y del interceptor. */
  logout(): void {
    this.clearSession();
    void this._router.navigate(['/shop/home']);
  }

  /**
   * Credenciales incorrectas: se avisa al usuario y se propaga el error para
   * que el consumidor decida (marcar el formulario, etc.). **No** se cierra
   * sesión: un password mal escrito no es una sesión expirada.
   */
  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    const detail = (error.error as IErrorResp | null | undefined)?.detail;
    this._alertService.getAlert(
      'Login',
      detail || 'Error al iniciar sesión',
      'warning',
    );
    return throwError(() => error);
  }

  private readRefreshToken(): string | null {
    const value = localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);
    return value ? value : null;
  }

  /** Elimina las claves del esquema anterior (token/user persistidos). */
  private purgeLegacySessionKeys(): void {
    for (const key of AuthService.LEGACY_SESSION_KEYS) {
      localStorage.removeItem(key);
    }
  }
}
