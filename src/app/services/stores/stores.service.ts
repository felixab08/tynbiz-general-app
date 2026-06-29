import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IPublicStore, IStoresResp, OptionsRequest } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class StoresService {
  private _http = inject(HttpClient);
  constructor() {}

  getStore(id: number): Observable<IStoresResp> {
    return this._http.get<IStoresResp>(`${baseUrl}/stores/${id}`);
  }
  getPublicStore(options: OptionsRequest): Observable<IPublicStore> {
    const { page = 0, size = 20 } = options;
    const params: any = { page, size };
    return this._http.get<IPublicStore>(`${baseUrl}/public/stores`, { params });
  }

  getFavoriteStore(options: OptionsRequest): Observable<IPublicStore> {
    const { page = 0, size = 20 } = options;
    const params: any = { page, size };
    return this._http.get<IPublicStore>(`${baseUrl}/me/favorite-stores`, {
      params,
    });
  }

  postAddFavoriteStore(storeId: any): Observable<any> {
    return this._http.post<any>(`${baseUrl}/me/favorite-stores/${storeId}`, {
      storeId,
    });
  }

  deleteAddFavoriteStore(storeId: any): Observable<any> {
    return this._http.delete<any>(`${baseUrl}/me/favorite-stores/${storeId}`);
  }
}
