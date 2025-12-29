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
      sort = '',
      endDate = '',
      startDate = '',
      searchTerm = '',
      status = '',
    } = options;

    // Construir params dinámicamente
    const params: any = {
      page,
      size,
      sort: sort || 'createdAt,desc',
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (searchTerm) params.searchTerm = searchTerm;
    if (status && status !== 'All') params.status = status;
    return this._http.get<IRequestDemo>(`${baseUrl}/demo-requests`, {
      params,
    });
  }

  getRequestDemoById(idDemo: number): Observable<RequestDemoContent> {
    return this._http.get<RequestDemoContent>(
      `${baseUrl}/demo-requests/${idDemo}`
    );
  }

  postRegisterDemo(user: IDemoCreate) {
    return this._http.post(`${baseUrl}/demo-requests/public`, user);
  }

  patchToggleDemo(id: number): Observable<RequestDemoContent> {
    return this._http.patch<RequestDemoContent>(
      `${baseUrl}/demo-requests/${id}/toggle-status`,
      {}
    );
  }
}
