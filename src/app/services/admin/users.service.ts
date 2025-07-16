import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsuariosResponse } from '@app/interfaces/admin/users.interface';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;
interface Options {
  page?: number;
  size?: number;
  sortBy?: string; //fechaCreacion
  sortDirection?: string; //DESC
}
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _http = inject(HttpClient);
  private userListCache = new Map<string, UsuariosResponse>();

  getUsers(options: Options): Observable<UsuariosResponse> {
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
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.userListCache.set(key, resp))
      );
  }
  postRegisterUser(user: UsuariosResponse) {}
}
