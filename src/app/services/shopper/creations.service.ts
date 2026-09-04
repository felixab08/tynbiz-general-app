import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IMyCreationsResp, OptionsRequest } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Service()
export class CreationsService {
  private _http = inject(HttpClient);

  getYourCreations(options: OptionsRequest): Observable<IMyCreationsResp> {
    const { page = 0, size = 10, startDate = '', searchTerm = '' } = options;

    // Construir params dinámicamente
    const params: any = {
      page,
      size,
    };
    if (startDate) params.startDate = startDate;
    if (searchTerm) params.searchTerm = searchTerm;
    return this._http.get<IMyCreationsResp>(
      `${baseUrl}/interaction-rooms/my-rooms`,
      {
        params,
      },
    );
  }

  getMyInvitation(options: OptionsRequest): Observable<any> {
    const { page = 0, size = 10, startDate = '', searchTerm = '' } = options;

    // Construir params dinámicamente
    const params: any = {
      page,
      size,
    };
    if (startDate) params.startDate = startDate;
    if (searchTerm) params.searchTerm = searchTerm;
    return this._http.get<any>(`${baseUrl}/interaction-rooms/my-invitations`, {
      params,
    });
  }
}
