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
    const {
      page = 0,
      size = 5,
      sortBy = '',
      fechaFin = '',
      fechaInicio = '',
      nombre = '',
      estado = '',
    } = options;
    const key = `${page} - ${size} - ${sortBy} - ${nombre} - ${estado} - ${fechaInicio} - ${fechaFin}`;

    if (this.userListCache.has(key)) {
      return of(this.userListCache.get(key)!);
    }
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
      sortBy: sortBy || 'fechaCreacion',
      sortDirection: 'DESC',
    };
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;
    if (nombre) params.nombre = nombre;
    if (estado) params.estado = estado;

    return this._http
      .get<UsuariosResponse>(`${baseUrl}/admin/users`, {
        params,
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
      tap((resp: any) => {
        this.updateUSerCache(resp);
      })
    );
  }

  updateUSerCache(user: UsuarioContent) {
    const userId = user.id;
    this.userListCache.forEach((userResponse) => {
      userResponse.content = userResponse.content.some((u) => u.id === userId)
        ? (userResponse.content = userResponse.content.map((currentUser) =>
            currentUser.id === userId ? user : currentUser
          ))
        : [user, ...userResponse.content];
    });
  }
}
