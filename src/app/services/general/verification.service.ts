import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  private _http = inject(HttpClient);

  postPlanes(token: string): Observable<string> {
    return this._http.post<string>(
      `${baseUrl}/auth/verify-email?token=${token}`,
      {},
    );
  }
}
