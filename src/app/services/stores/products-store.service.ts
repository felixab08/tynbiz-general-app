import {
  IProductStoreResponse,
  OptionsRequest,
} from '@app/interfaces';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductsStoreService {
  private _http = inject(HttpClient);

  getProductsByStore(options: OptionsRequest): Observable<IProductStoreResponse> {
    const {
      page = 0,
      size = 20,
      searchTerm = 'shirt',
    } = options;
    // Construir params dinámicamente
    const params: any = {
      searchTerm,
      page,
      size,
    };
      if (searchTerm) params.searchTerm = searchTerm;
    return this._http.post<IProductStoreResponse>(
      `${baseUrl}/proxy/falabella/products`,
      params
    );
  }


}

