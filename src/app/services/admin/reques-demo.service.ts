import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IDemoCreate,
  IRequestDemo,
  OptionsRequest,
  RequestDemoContent,
} from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class RequesDemoService {
  private _http = inject(HttpClient);
  private demoListCache = new Map<string, IRequestDemo>();

  getRequestDemo(options: OptionsRequest): Observable<IRequestDemo> {
    const {
      page = 0,
      size = 5,
      sort = 'createdAt,desc',
      endDate = '',
      startDate = '',
      nombre = '',
      status = '',
    } = options;
    const key = `${page} - ${size} - ${sort}`;

    if (this.demoListCache.has(key)) {
      return of(this.demoListCache.get(key)!);
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
    if (sort) params.sort = sort;
    return this._http.get<IRequestDemo>(`${baseUrl}/demo-requests`, {
      params,
    });
  }

  getRequestDemoById(idDemo: number): Observable<RequestDemoContent> {
    return this._http.get<RequestDemoContent>(
      `${baseUrl}/demo-requests${idDemo}`
    );
  }

  postRegisterDemo(user: IDemoCreate) {
    return this._http.post(`${baseUrl}/demo-requests/public`, user);
  }
}
