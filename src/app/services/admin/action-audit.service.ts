import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IActionAuditResponse, OptionsRequest } from '@app/interfaces';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ActionAuditService {
  private _http = inject(HttpClient);

  getActionAudit(options: OptionsRequest): Observable<IActionAuditResponse> {
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
    return this._http.get<IActionAuditResponse>(
      `${baseUrl}/admin/action-audit/search`,
      {
        params,
      }
    );
  }
}
