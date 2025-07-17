import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface';
import { StoreService } from '@app/services/store.service';
import { Router } from '@angular/router';

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

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/login`, {
        usuarioAcceso: username,
        contrasenia: password,
      })
      .pipe(
        map((data) => {
          if (data) {
            console.log('User found:', data);
            return this.handleAuthSuccess(data.user, data.token);
          } else {
            throw new Error('User not found');
          }
        }),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  //searhUserById(id: number): Observable<boolean> {
  //  return this.http
  //    .get<any>(`${baseUrl}/users/${id}`)
  //    .pipe(catchError((error: any) => this.handleAuthError(error)));
  // }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    this.handleAuthSuccess(this._user() as User, token);
    return of(true);
    //   return this.http
    //     .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
    //       // headers: {
    //       //   Authorization: `Bearer ${token}`,
    //       // },
    //     })
    //     .pipe(
    //       map((resp) => this.handleAuthSuccess(resp)),
    //       catchError((error: any) => this.handleAuthError(error))
    //     );
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

    this._user.set({
      usuarioId: user?.usuarioId,
      correo: user?.correo,
      nombre: user?.nombre,
      apellido: user?.apellido,
      roles: user.roles,
      image: user?.image,
      fechaNacimiento: user?.fechaNacimiento,
    });

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
}
