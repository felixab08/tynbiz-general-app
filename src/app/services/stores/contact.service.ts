import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IContactResp, OptionsRequest } from '@app/interfaces';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Service()
export class ContactService {
  private _http = inject(HttpClient);

  getContactByStore(options: OptionsRequest): Observable<IContactResp> {
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
    return this._http.get<IContactResp>(`${baseUrl}/appointments`, {
      params,
    });
  }

  patchangeStatusContact(
    idContact: number,
    status: 'CONFIRMADA' | 'RECHAZADA',
    reason?: string,
  ): Observable<any> {
    return this._http.patch<any>(
      `${baseUrl}/appointments/${idContact}/status`,
      {
        status,
        reason,
      },
    );
  }
}
