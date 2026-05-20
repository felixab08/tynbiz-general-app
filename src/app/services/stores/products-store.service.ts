import { IProductStoreResp, OptionsRequest } from '@app/interfaces';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { lastValueFrom } from 'rxjs';
const baseUrl = environment.baseUrl;
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { LinkParamService } from '../general/link-params.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsStoreService {
  private _http = inject(HttpClient);
  _linkService = inject(LinkParamService);
  private queryClient = inject(QueryClient);

  getProductsByStore(options: OptionsRequest): Promise<IProductStoreResp> {
    const page = options['page'] ?? 0;
    const size = options['size'] ?? 5;
    const searchTerm = options['searchTerm'] ?? '';
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
    };
    if (searchTerm) params.searchTerm = searchTerm;
    return lastValueFrom(
      this._http.get<IProductStoreResp>(
        `${baseUrl}/integrations/wordpress/products`,
        { params },
      ),
    );
  }

  ProductsByStoreQuery = injectQuery<IProductStoreResp>(() => ({
    queryKey: [
      'products-by-store',
      {
        page: this._linkService.currentPage() - 1,
        size: this._linkService.currentSize(),
        searchTerm: this._linkService.currentSearchTerm(),
      },
    ],
    queryFn: () =>
      this.getProductsByStore({
        page: this._linkService.currentPage() - 1 || 0,
        size: this._linkService.currentSize() || 5,
        searchTerm: this._linkService.currentSearchTerm() || '',
      }),
    staleTime: 1000 * 60 * 5, // 5 minuto
  }));

  prefetchIssue(page: any) {
    this.queryClient.prefetchQuery({
      queryKey: [
        'products-by-store',
        {
          page: page,
          size: this._linkService.currentSize(),
          searchTerm: this._linkService.currentSearchTerm(),
        },
      ],
      queryFn: () =>
        this.getProductsByStore({
          page: page || 0,
          size: this._linkService.currentSize() || 5,
          searchTerm: this._linkService.currentSearchTerm() || '',
        }),
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  }
}
