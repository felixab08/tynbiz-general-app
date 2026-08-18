import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IIterationRoomReq } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Service()
export class InterationRoomService {
  private _http = inject(HttpClient);

  postIterarionRoom(room: IIterationRoomReq): Observable<any> {
    return this._http.post<any>(`${baseUrl}/interaction-rooms`, room);
  }
}
