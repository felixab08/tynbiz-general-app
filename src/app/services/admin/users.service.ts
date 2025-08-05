import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  UsuarioContent,
  UsuariosResponse,
} from '@app/interfaces/admin/users.interface';
import { OptionsRequest } from '@app/interfaces/services/services.interface';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _http = inject(HttpClient);
  private userListCache = new Map<string, UsuariosResponse>();

  getUsers(options: OptionsRequest): Observable<UsuariosResponse> {
    const { page = 0, size = 5, sortBy = '' } = options;
    const key = `${page} - ${size} - ${sortBy}`;

    if (this.userListCache.has(key)) {
      return of(this.userListCache.get(key)!);
    }
    return this._http
      .get<UsuariosResponse>(`${baseUrl}/usuario/listar`, {
        params: {
          page,
          size,
          sortBy: sortBy || 'fechaCreacion', // Default sort by field
          sortDirection: 'DESC', // Default sort direction
        },
      })
      .pipe(tap((resp) => this.userListCache.set(key, resp)));
  }

  getUserById(idUsuario: string): Observable<UsuarioContent> {
    return this._http
      .get<UsuarioContent>(`${baseUrl}/usuario/obtener/${idUsuario}`)
      .pipe(tap((resp) => console.log(resp)));
  }

  postRegisterUser(user: UsuarioContent) {
    return this._http.post(`${baseUrl}/usuario/registrar`, user).pipe(
      tap((resp) => {
        this.updateUSerCache(user);
      })
    );
  }

  updateUSerCache(user: UsuarioContent) {
    const userId = user.id;
    this.userListCache.forEach((userResponse) => {
      userResponse.content = userResponse.content.map((currentUser) => {
        return currentUser.id === userId ? user : currentUser;
      });
    });
  }
}
