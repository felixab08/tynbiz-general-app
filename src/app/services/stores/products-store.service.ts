import {
  IProductStore,
  IProduct,
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
  getProductsByIdStore(idStore: number): Observable<IProductStore[]> {
    return this._http.get<IProductStore[]>(
      `${baseUrl}/products/store/${idStore}`
    );
  }
  getProductById(idProduct: number): Observable<IProduct> {
    return this._http.get<IProduct>(
      `${baseUrl}/products/${idProduct}`
    );

  }
  getCompleteProductsByStore(idStore: number): Observable<IProduct[]> {
  return this.getProductsByIdStore(idStore).pipe(
    switchMap((productsStore: IProductStore[]) => {

      if (!productsStore.length) {
        return of([]);
      }

      const productRequests: Observable<IProduct>[] =
        productsStore.map(product => {
          return this.getProductById(product.id,);
        });
      return forkJoin(productRequests);
    })
  );
}
}

