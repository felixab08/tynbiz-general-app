import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OptionsRequest, RolesResponse } from '@app/interfaces';
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
      sort = '',
      endDate = '',
      startDate = '',
      nombre = '',
      status = '',
    } = options;
    const key = `${page} - ${size} - ${sort}`;

    if (this.roleListCache.has(key)) {
      return of(this.roleListCache.get(key)!);
    }
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
      sort: sort || 'fechaCreacion',
      sortDirection: 'desc',
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (nombre) params.nombre = nombre;
    if (status) params.status = status;

    return this._http
      .get<RolesResponse>(`${baseUrl}/admin/roles/search`, {
        params,
      })
      .pipe(tap((resp) => this.roleListCache.set(key, resp)));
  }
}
