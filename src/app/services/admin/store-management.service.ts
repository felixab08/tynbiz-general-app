import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OptionsRequest, IStoreManagementSearch } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;
type storeStatus = 'suspend' | 'activate' | 'cancel' | 'complete-onboarding';
@Injectable({
  providedIn: 'root',
})
export class StoreManagementService {
  private _http = inject(HttpClient);
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

    return this._http.get<IStoreManagementSearch>(
      `${baseUrl}/stores/admin/search`,
      {
        params,
      }
    );
  }
  putStoreState(id: number, status: storeStatus) {
    return this._http.put(`${baseUrl}/stores/${id}/${status}`, { id });
  }
}
