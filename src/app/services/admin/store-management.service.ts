import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  OptionsRequest,
  IStoreManagementSearch,
  StoreSeachContent,
  IStore,
} from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;
type storeStatus = 'SUSPENDED' | 'ACTIVE' | 'CANCELLED' | 'PENDING';
@Injectable({
  providedIn: 'root',
})
export class StoreManagementService {
  private _http = inject(HttpClient);
  private _userListCache = new Map<string, IStoreManagementSearch>();

  /**
   * Obtiene la lista de tiendas con paginación y filtros
   * @param options Opciones de solicitud que incluyen paginación y filtros
   * @returns Observable con la respuesta de la lista de tiendas
   */
  getAllStoresSeach(
    options: OptionsRequest,
  ): Observable<IStoreManagementSearch> {
    const {
      page = 0,
      size = 5,
      sort = '',
      endDate = '',
      startDate = '',
      searchTerm = '',
      status = '',
    } = options;
    const key = `${page} - ${size} - ${sort} - ${searchTerm} - ${status} - ${startDate} - ${endDate}`;
    if (this._userListCache.has(key)) {
      return of(this._userListCache.get(key)!);
    }
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

    return this._http
      .get<IStoreManagementSearch>(`${baseUrl}/stores/admin/search`, {
        params,
      })
      .pipe(tap((resp) => this._userListCache.set(key, resp)));
  }
  /**
   * Actualiza el estado de una tienda
   * @param id ID de la tienda
   * @param status Nuevo estado de la tienda
   * @returns Observable con la respuesta de la tienda actualizada
   */
  putStoreState(
    id: number,
    status: storeStatus,
  ): Observable<StoreSeachContent> {
    return this._http
      .patch<StoreSeachContent>(`${baseUrl}/stores/${id}/status`, { status })
      .pipe(
        tap((resp: any) => {
          this.updateStoreListCache(resp);
        }),
      );
  }

  /**
   * Actualiza la caché de la lista de tiendas
   * @param store Tienda actualizada
   */
  updateStoreListCache(store: StoreSeachContent) {
    const storeId = store.id;
    this._userListCache.forEach((userResponse) => {
      userResponse.content = userResponse.content.some((u) => u.id === storeId)
        ? (userResponse.content = userResponse.content.map((currentUser) =>
            currentUser.id === storeId ? store : currentUser,
          ))
        : [store, ...userResponse.content];
    });
  }

  /**
   * Obtiene los detalles de una tienda por su ID
   * @param id ID de la tienda
   * @returns Observable con los detalles de la tienda
   */
  getStoreById(id: number): Observable<IStore> {
    return this._http
      .get<IStore>(`${baseUrl}/stores/${id}`)
      .pipe(tap((resp) => console.log(resp)));
  }
}
