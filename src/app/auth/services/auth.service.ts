import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  AuthResponse,
  IRefreshToken,
} from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface';
import { StoreService } from '@app/services/store.service';
import { Router } from '@angular/router';
import { IErrorGeneralResp, IRegisterReq } from '@app/interfaces';
import { AlertService } from '@app/services';
import AccountComponent from './../../pages/account/account.component';
import { MenuService } from './menu.service';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  public storeService = inject(StoreService);
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _alertService = inject(AlertService);
  private _menuService = inject(MenuService);
  private http = inject(HttpClient);
  _router = inject(Router);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => {
    return this._user()?.role.includes('admin') ?? false;
  });
  constructor() {
    // Restaurar usuario y estado desde localStorage al inicializar
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this._user.set(user);
        this._token.set(storedToken);
        this._authStatus.set('authenticated');
        this.storeService.user.next(user);
        this.storeService.refreshTokenSubject.next(storedRefreshToken);
      } catch (error) {
        console.error('Error restaurando usuario del localStorage:', error);
        this.logout();
      }
    } else {
      this._authStatus.set('not-authenticated');
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: username,
        password: password,
      })
      .pipe(
        map((data) => {
          if (data) {
            console.log('User found:', data);
            return this.handleAuthSuccess(
              data.user,
              data.accessToken,
              data.refreshToken,
            );
          } else {
            console.log('error');
            throw new Error('User not found');
          }
        }),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  refreshTokenUser(refreshToken: string): Observable<boolean | void> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/refresh`, {
        refreshToken: refreshToken,
      })
      .pipe(
        map((data) => {
          if (data) {
            console.log('User found:', data);
            this.handleAuthSuccess(data.user, data.accessToken, refreshToken);
          } else {
            console.log('error');
            throw new Error('User not found');
          }
        }),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token || !userJson) {
      this.logout();
      return of(false);
    }

    try {
      this.refreshTokenUser(refreshToken as string);
      return of(true);
    } catch (error) {
      console.error('Error al restaurar usuario:', error);
      this.logout();
      return of(false);
    }
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.clear();
    this._router.navigate(['/shop/home']);
    // TODO: se quería probar que se cambie el menu pero a lo que se esta probando no esta funcionando a menos que se refresque la paguina
    this._menuService.redirectLinkForRole();
  }

  logoutAndReload() {
    this.logout();
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  public handleAuthSuccess(user: User, token: string, refreshToken: string) {
    this._user.set(user);

    this.storeService.user.next(this._user() as User);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('user', JSON.stringify(this._user() as User));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    return true;
  }

  private handleAuthError(error: IErrorGeneralResp) {
    this.logout();
    this._alertService.getAlert(
      'Login',
      error.error.detail || 'Error al iniciar sesión',
      'warning',
    );
    console.log(error);

    return of(false);
  }

  postRegisterBuyerUser(register: IRegisterReq) {
    return this.http.post(`${baseUrl}/auth/register-buyer`, register);
  }
}
