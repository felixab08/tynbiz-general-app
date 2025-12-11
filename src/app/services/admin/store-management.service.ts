import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OptionsRequest, IStoreManagementResponse } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class StoreManagementService {
  private _http = inject(HttpClient);
  private storeManamentListCache = new Map<string, IStoreManagementResponse>();

  getAllStores(options: OptionsRequest): Observable<IStoreManagementResponse> {
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

    if (this.storeManamentListCache.has(key)) {
      return of(this.storeManamentListCache.get(key)!);
    }
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
      sort: sort || 'createdAt,desc',
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (nombre) params.nombre = nombre;
    if (status) params.status = status;

    return this._http
      .get<IStoreManagementResponse>(`${baseUrl}/api/v1/stores`, {
        params,
      })
      .pipe(tap((resp) => this.storeManamentListCache.set(key, resp)));
  }
}
