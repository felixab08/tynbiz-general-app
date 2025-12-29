import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  OptionsRequest,
  IStoreManagementSearch,
  StoreSeachContent,
} from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;
type storeStatus = 'suspend' | 'activate' | 'cancel' | 'complete-onboarding';
@Injectable({
  providedIn: 'root',
})
export class StoreManagementService {
  private _http = inject(HttpClient);
  private _userListCache = new Map<string, IStoreManagementSearch>();

  getAllStoresSeach(
    options: OptionsRequest
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
  putStoreState(
    id: number,
    status: storeStatus
  ): Observable<StoreSeachContent> {
    return this._http
      .put<StoreSeachContent>(`${baseUrl}/stores/${id}/${status}`, { id })
      .pipe(
        tap((resp: any) => {
          this.updateStoreListCache(resp);
        })
      );
  }
  updateStoreListCache(store: StoreSeachContent) {
    const storeId = store.id;
    this._userListCache.forEach((userResponse) => {
      userResponse.content = userResponse.content.some((u) => u.id === storeId)
        ? (userResponse.content = userResponse.content.map((currentUser) =>
            currentUser.id === storeId ? store : currentUser
          ))
        : [store, ...userResponse.content];
    });
  }
}
