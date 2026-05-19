import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IMeSuscriptionStore,
  ISuscription,
  ISuscriptionEligibility,
  ISuscriptionResponse,
  OptionsRequest,
} from '@app/interfaces';
import { environment } from '@environments/environment.development';
import { Observable, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class SuscriptionService {
  private _http = inject(HttpClient);

  /**
   * @description Obtiene la lista de solicitudes de suscripción.
   * @params options Type <OptionsRequest>
   * @param page = 0, PAGINA
   * @param size : 20, CANTIDAD
   * @param sort : createdAt,desc ORDEN
   * @return ISuscriptionResponse[]
   */
  getSuscriptionRequest(
    options: OptionsRequest,
  ): Observable<ISuscriptionResponse> {
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
    return this._http.get<ISuscriptionResponse>(
      `${baseUrl}/admin/subscription-requests`,
      {
        params,
      },
    );
  }
  /**
   * @description Obtener suscripción por ID
   * @param id
   * @returns Observable<ISuscription>
   */
  getSuscriptionById(id: number): Observable<ISuscription> {
    return this._http.get<ISuscription>(
      `${baseUrl}/admin/subscription-requests/${id}`,
    );
  }
  /**
   * @description Incorporar suscripción por ID
   * @param id
   * @returns Observable<ISuscription>
   */
  postSuscriptionIncoporateById(id: number): Observable<ISuscription> {
    return this._http.post<ISuscription>(
      `${baseUrl}/admin/subscription-requests/${id}/incorporate`,
      id,
    );
  }

  // Stores Part
  getMeSuscriptionByStore(): Observable<IMeSuscriptionStore> {
    return this._http.get<IMeSuscriptionStore>(
      `${baseUrl}/subscriptions/me/current`,
    );
  }
  getSuscriptionByEligilitiStore(): Observable<ISuscriptionEligibility> {
    return this._http.get<ISuscriptionEligibility>(
      `${baseUrl}/subscriptions/me/change-plan/eligibility`,
    );
  }

  putChangePlanStore(planId: number): Observable<void> {
    return this._http.put<void>(
      `${baseUrl}/subscriptions/${planId}/change-plan`,
      null,
    );
  }
}
