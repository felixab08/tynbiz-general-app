import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IProductoRequest,
  IProductoResponse,
  OptionsProductRequest,
} from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private _http = inject(HttpClient);
  private productoListCache = new Map<string, IProductoResponse>();

  /**
   * Busca productos con filtros opcionales y paginación
   * @param options OptionsProductRequest
   * @returns IProductoResponse
   */
  getPersona(options: OptionsProductRequest): Observable<IProductoResponse> {
    const {
      storeId = 1,
      categoryCatId = 1,
      searchTerm = 'shirt',
      minPrice = 10,
      maxPrice = 100,
      isActive = true,
      featured = false,
      inStock = true,
      hasDiscount = false,
      page = 0,
      size = 10,
      sortBy = 'name',
      sortDirection = 'DESC',
    } = options;
    const key = `${page} - ${size} - ${sortBy}`;

    if (this.productoListCache.has(key)) {
      return of(this.productoListCache.get(key)!);
    }
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
      sortBy: sortBy || 'name',
      sortDirection: 'DESC',
    };
    if (storeId) params.storeId = storeId;
    if (categoryCatId) params.categoryCatId = categoryCatId;
    if (searchTerm) params.searchTerm = searchTerm;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (isActive) params.isActive = isActive;
    if (featured) params.featured = featured;
    if (inStock) params.inStock = inStock;
    if (hasDiscount) params.hasDiscount = hasDiscount;
    if (sortDirection) params.sortDirection = sortDirection;

    return this._http
      .get<IProductoResponse>(`${baseUrl}/products`, {
        params,
      })
      .pipe(tap((resp) => this.productoListCache.set(key, resp)));
  }
  postRegisterUser(producto: IProductoRequest) {
    return this._http.post(`${baseUrl}/products`, producto);
  }

  putRegisterUser(idProducto: number, producto: IProductoRequest) {
    return this._http.post(`${baseUrl}/products${idProducto}`, producto);
  }
}
