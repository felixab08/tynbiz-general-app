import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InvoicesPayment, InvoicesResp } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private _http = inject(HttpClient);

  getInvoicesByStore(): Observable<InvoicesResp[]> {
    return this._http.get<InvoicesResp[]>(`${baseUrl}/invoices/my`);
  }

  postInvoicePayment(pagoDate: InvoicesPayment) {
    return this._http.post(`${baseUrl}/contents`, pagoDate);
  }
}
