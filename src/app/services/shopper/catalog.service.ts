import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { CatalogResponse } from '@app/interfaces';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private _http = inject(HttpClient);

  getDepartamento(): Observable<CatalogResponse[]> {
    return this._http
      .get<CatalogResponse[]>(`${baseUrl}/api/ubigeo/catalog?tableId=1`)
      .pipe(tap((resp) => console.log(resp)));
  }
}
