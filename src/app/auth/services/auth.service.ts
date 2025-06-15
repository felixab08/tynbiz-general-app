import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

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

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        username: username,
        password: password,
      })
      .pipe(
        map((resp) =>
          this.searhUserById(resp.id).subscribe((data: any) => {
            if (data) {
              return this.handleAuthSuccess(data, resp.accessToken);
            } else {
              throw new Error('User not found');
            }
          })
        ),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  searhUserById(id: number): Observable<boolean> {
    return this.http
      .get<any>(`${baseUrl}/users/${id}`)
      .pipe(catchError((error: any) => this.handleAuthError(error)));
  }

  // checkStatus(): Observable<boolean> {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     this.logout();
  //     return of(false);
  //   }

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
  // }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess(user: any, token: string) {
    console.log('user', user);

    this._user.set({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      image: user.image,
      birthDate: user.birthDate,
    } as User);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
