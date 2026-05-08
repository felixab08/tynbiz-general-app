import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;
export interface IUbigeo {
  ubigeoId: string;
  distrito: string;
}
@Injectable({
  providedIn: 'root',
})
export class UbigeoService {
  private _http = inject(HttpClient);

  getDepartamento(): Observable<string[]> {
    return this._http.get<string[]>(`${baseUrl}/ubigeo/departamentos`);
  }

  getProvincias(idDepartamento: string): Observable<string[]> {
    return this._http.get<string[]>(
      `${baseUrl}/ubigeo/provincias?departamento=${idDepartamento}`,
    );
  }

  getDistrito(
    idDepartamento: string,
    idProvincia: string,
  ): Observable<IUbigeo[]> {
    return this._http.get<IUbigeo[]>(
      `${baseUrl}/ubigeo/distritos?departamento=${idDepartamento}&provincia=${idProvincia}`,
    );
  }
}
