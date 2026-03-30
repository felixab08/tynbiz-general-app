import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  private _http = inject(HttpClient);

  getShopifyData() {
    return this._http.get(`${baseUrl}/integrations/shopify/connect`);
  }

  getShopifyConnection() {
    return this._http.get(`${baseUrl}/products?shopify=connected`);
  }
  /**
   * Token por defauld
   * @returns boolean
   */
  getShopifyStatus() {
    return this._http.get<boolean>(`${baseUrl}/integrations/shopify/status`);
  }
}
