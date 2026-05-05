import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface';
import { StoreService } from '@app/services/store.service';
import { Router } from '@angular/router';
import { IRegisterReq } from '@app/interfaces';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  public storeService = inject(StoreService);
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);
  _router = inject(Router);

  // checkStatusResource = rxResource({
  //   loader: () => this.checkStatus(),
  // });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);

  constructor() {
    // Restaurar usuario y estado desde localStorage al inicializar
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this._user.set(user);
        this._token.set(storedToken);
        this._authStatus.set('authenticated');
        this.storeService.user.next(user);
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
            return this.handleAuthSuccess(data.user, data.accessToken);
          } else {
            throw new Error('User not found');
          }
        }),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  //searhUserById(id: number): Observable<boolean> {
  //  return this.http
  //    .get<any>(`${baseUrl}/users/${id}`)
  //    .pipe(catchError((error: any) => this.handleAuthError(error)));
  // }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      this.logout();
      return of(false);
    }

    try {
      const user = JSON.parse(userJson) as User;
      this.handleAuthSuccess(user, token);
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
  }

  logoutAndReload() {
    this.logout();
    location.reload();
  }

  private handleAuthSuccess(user: User, token: string) {
    console.log('user OK', user);

    this._user.set(user);

    this.storeService.user.next(this._user() as User);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('user', JSON.stringify(this._user() as User));
    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  postRegisterBuyerUser(register: IRegisterReq) {
    return this.http.post(`${baseUrl}/auth/register-buyer`, register);
  }
}
