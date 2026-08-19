import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {
  ContentNotificationRoomResp,
  IIterationRoomReq,
  PostNotificacionWSReq,
  UserSearchResp,
} from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Service()
export class InterationRoomService {
  private _http = inject(HttpClient);

  postIterarionRoom(room: IIterationRoomReq): Observable<any> {
    return this._http.post<any>(`${baseUrl}/interaction-rooms`, room);
  }

  getCategoryByStore(email: string): Observable<UserSearchResp> {
    return this._http.get<UserSearchResp>(
      `${baseUrl}/public/users/search?query=${email}&page=0&size=100`,
    );
  }

  postNotificacionWS(
    notification: PostNotificacionWSReq,
  ): Observable<ContentNotificationRoomResp> {
    return this._http.post<ContentNotificationRoomResp>(
      `${baseUrl}/notificacionWS/send`,
      notification,
    );
  }
}
