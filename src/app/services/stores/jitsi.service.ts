import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IJitsiResp } from '@app/interfaces/stores/jitsi.interface';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  private _http = inject(HttpClient);

  getJitsiStatus(idContenido: number): Observable<IJitsiResp> {
    return this._http.get<IJitsiResp>(`${baseUrl}/jitsi/token/${idContenido}`);
  }

  getNotificacionWS(): Observable<any> {
    return this._http.get<any>(`${baseUrl}/notificacionWS/unread`);
  }
}
