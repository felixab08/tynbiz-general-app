import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPlan, IPlanResponse, OptionsRequest } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class PlanesService {
  private _http = inject(HttpClient);
  private planListCache = new Map<string, IPlanResponse>();

  /**
   * @description Obtiene la lista de planes de suscripción disponibles para selección pública.
   * @params options Type <OptionsRequest>
   * @param page = 0, PAGINA
   * @param size : 20, CANTIDAD
   * @param sort : createdAt,desc ORDEN
   * @return IPlanResponse[]
   */
  getPlanes(options: OptionsRequest): Observable<IPlanResponse> {
    const {
      page = 0,
      size = 5,
      sort = '',
      fechaFin = '',
      fechaInicio = '',
      nombre = '',
      status = '',
    } = options;
    const key = `${page} - ${size} - ${sort}`;

    if (this.planListCache.has(key)) {
      return of(this.planListCache.get(key)!);
    }
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
      sort: sort || 'createdAt,desc',
    };
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;
    if (nombre) params.nombre = nombre;
    if (status) params.status = status;
    if (sort) params.sort = sort;
    return this._http.get<IPlanResponse>(`${baseUrl}/subscription-plans/all`, {
      params,
    });
  }

  /**
   * @description Obtiene la lista de planes de suscripción disponibles para selección pública.
   * @params options Type <OptionsRequest>
   * @param {isActive = true}, cuando son Activos
   * @param {isPublic = true}, cuando son Públicos
   * @returns Array<IPlan>
   */
  getPlanesPublicos(options: OptionsRequest): Observable<IPlan[]> {
    const { isActive, isPublic } = options;

    // Construir params dinámicamente
    const params: any = {
      isActive,
      isPublic,
    };
    return this._http.get<IPlan[]>(`${baseUrl}/public/subscriptions/plans`, {
      params,
    });
  }
}
