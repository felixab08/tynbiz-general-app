import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsersActionsResponse } from '@app/interfaces/admin/actions-user';
import { OptionsRequest } from '@app/interfaces/services/services.interface';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ActionsUserService {
  private _http = inject(HttpClient);
  private actionsListCache = new Map<string, UsersActionsResponse>();

  getUsersActions(options: OptionsRequest): Observable<UsersActionsResponse> {
    const { page = 0, size = 5, sortBy = '' } = options;
    const key = `${page} - ${size} - ${sortBy}`;

    if (this.actionsListCache.has(key)) {
      return of(this.actionsListCache.get(key)!);
    }
    return this._http
      .get<UsersActionsResponse>(`${baseUrl}/historialaccion/ultimas`, {
        params: {
          page,
          size,
        },
      })
      .pipe(tap((resp) => this.actionsListCache.set(key, resp)));
  }
}
