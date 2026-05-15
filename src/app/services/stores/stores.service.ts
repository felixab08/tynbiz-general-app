import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IStoresResp } from '@app/interfaces';
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
}
