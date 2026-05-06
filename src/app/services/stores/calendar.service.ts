import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICalendar } from '@app/interfaces';
import { environment } from '@environments/environment.development';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private _http = inject(HttpClient);

  constructor() {}

  getCalendarConfig() {
    return this._http.get<ICalendar>(`${environment.baseUrl}/calendars/my-config`).pipe(
      tap((calendar: ICalendar) => {
        console.log('Datos de ICalendar:', calendar);
      })
    );
  }
  putCalendarConfig(calendar: ICalendar) {
    return this._http.put(`${environment.baseUrl}/calendars/my-config`, calendar);
  }

}
