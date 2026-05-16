import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IMercadoPagoResp } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private _http = inject(HttpClient);

  postMercadoPagoPayment(invoiceId: any): Observable<IMercadoPagoResp> {
    return this._http.post<IMercadoPagoResp>(
      `${baseUrl}/mercadopago/payments`,
      invoiceId,
    );
  }
}
