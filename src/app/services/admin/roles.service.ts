import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RolesResponse } from '@app/interfaces/admin/roles.interface';
import { OptionsRequest } from '@app/interfaces/services/services.interface';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private _http = inject(HttpClient);
  private roleListCache = new Map<string, RolesResponse>();

  getRoles(options: OptionsRequest): Observable<RolesResponse> {
    const {
      page = 0,
      size = 5,
      sortBy = '',
      fechaFin = '',
      fechaInicio = '',
      nombre = '',
      estado = '',
    } = options;
    const key = `${page} - ${size} - ${sortBy}`;

    if (this.roleListCache.has(key)) {
      return of(this.roleListCache.get(key)!);
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
      .get<RolesResponse>(`${baseUrl}/rol/listar/roles-paginado`, {
        params,
      })
      .pipe(tap((resp) => this.roleListCache.set(key, resp)));
  }
}
