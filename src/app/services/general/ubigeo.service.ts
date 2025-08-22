import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;
type ubigeoResponse = {
  id?: string;
  ubigeo: string;
  nombre: string;
};
@Injectable({
  providedIn: 'root',
})
export class UbigeoService {
  private _http = inject(HttpClient);

  getDepartamento(): Observable<ubigeoResponse> {
    return this._http
      .get<ubigeoResponse>(`${baseUrl}/api/ubigeo/departamentos`)
      .pipe(tap((resp) => console.log(resp)));
  }

  getProvincias(idDepartamento: string): Observable<ubigeoResponse> {
    return this._http
      .get<ubigeoResponse>(
        `${baseUrl}/api/ubigeo/departamentos/${idDepartamento}/provincias`
      )
      .pipe(tap((resp) => console.log(resp)));
  }
  getDistrito(idProvincia: string): Observable<ubigeoResponse> {
    return this._http
      .get<ubigeoResponse>(
        `${baseUrl}/api/ubigeo/provincia/${idProvincia}/distritos`
      )
      .pipe(tap((resp) => console.log(resp)));
  }
}
