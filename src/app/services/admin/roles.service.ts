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
    const { page = 0, size = 5, sortBy = '' } = options;
    const key = `${page} - ${size} - ${sortBy}`;

    if (this.roleListCache.has(key)) {
      return of(this.roleListCache.get(key)!);
    }
    return this._http
      .get<RolesResponse>(`${baseUrl}/rol/listar`, {
        params: {
          page,
          size,
          sortBy: sortBy || 'fechaCreacion', // Default sort by field
          sortDirection: 'DESC', // Default sort direction
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.roleListCache.set(key, resp))
      );
  }
}
