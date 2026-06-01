import { Component, inject, signal } from '@angular/core';
import { InvoicesResp } from '@app/interfaces';
import { InvoicesService } from '@app/services';

@Component({
  selector: 'tyn-history-payment',
  imports: [],
  templateUrl: './history-payment.page.html',
})
export class HistoryPaymentPage {
  private _invoicesService = inject(InvoicesService);
  invoices = signal<InvoicesResp[] | null>(null);

  constructor() {
    this.getInvoicesMedhod();
  }
  private getInvoicesMedhod() {
    this._invoicesService
      .getInvoicesByStore('DRAFT,SENT,PAID,OVERDUE,CANCELLED,REFUNDED')
      .subscribe({
        next: (invoices) => {
          this.invoices.set(invoices);
        },
      });
  }
}
