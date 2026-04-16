import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IconnectWordpress, IStatusWordpress } from '@app/interfaces';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  private _http = inject(HttpClient);

  postIntegrationWordpress(siteUrl: string): Observable<IconnectWordpress> {
    return this._http.post<IconnectWordpress>(
      `${baseUrl}/integrations/wordpress/connect`,
      { siteUrl },
    );
  }

  getWordpressConnection() {
    return this._http.get(`/products?wordpress=connected`);
  }

  /**
   * Token por defauld
   * @returns IStatusWordpress
   */
  getWordpressStatus() {
    return this._http.get<IStatusWordpress>(
      `${baseUrl}/integrations/wordpress/status`,
    );
  }

  getWordpressProducts() {
    return this._http.get(`${baseUrl}/integrations/wordpress/products`);
  }
}
