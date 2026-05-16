import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AlertService,
  InvoicesService,
  MercadoPagoService,
  StoreService,
  StoresService,
} from '@app/services';
import {
  IErrorGeneralResp,
  InvoicesPayResp,
  InvoicesResp,
  IStoresResp,
} from '@app/interfaces';
import { User } from '@app/auth/interfaces/user.interface';
import { PaymentsMapper } from './payments.mapper';
import { environment } from '@environments/environment';

@Component({
  selector: 'tyn-suscription-store-page',
  imports: [CommonModule, DatePipe],
  templateUrl: './suscription-store-page.component.html',
})
export default class SuscriptionStorePageComponent {
  selectedTab: 'plans' | 'paymentMethod' | 'billingHistory' = 'plans';
  isModalOpen = signal(false);
  isModalConfirOpen = signal(false);
  invoices = signal<InvoicesResp[] | null>(null);
  invoicePay = signal<InvoicesResp | null>(null);
  invoicePayMethod = signal<string | null>(null);
  infoStoreIntifraud = signal<IStoresResp | null>(null);
  invoicesPayResp = signal<InvoicesPayResp | null>(null);
  private _invoicesService = inject(InvoicesService);
  private _storesService = inject(StoresService);
  private _mercadoPagoService = inject(MercadoPagoService);
  private _alertService = inject(AlertService);
  private storeService = inject(StoreService);
  private user: User | undefined;

  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      if (this.user?.storeId) {
        this.getInvoicesStore();
      }
    });

    this.getInvoicesMedhod();
  }

  paySuscription() {
    if (this.invoicePay() && this.infoStoreIntifraud()) {
      const paymentData = PaymentsMapper.mapInvoiceToPaymentMethod(
        this.invoicePay()!,
        this.infoStoreIntifraud()!,
        this.invoicePayMethod()!,
      );
      console.log(paymentData);
      if (paymentData && this.invoicePayMethod() === 'Niubiz') {
        this._invoicesService.postInvoicePayment(paymentData).subscribe({
          next: (response) => {
            console.log('Pago exitoso:', response);
            this.invoicesPayResp.set(response);
          },
          error: (error: IErrorGeneralResp) => {
            this._alertService.getAlert(
              'Error!!!',
              error.error.detail || 'Error al procesar el pago',
              'error',
            );
          },
        });
      }
      if (paymentData && this.invoicePayMethod() === 'MercadoPago') {
        this._mercadoPagoService.postMercadoPagoPayment(paymentData).subscribe({
          next: (response) => {
            console.log('Pago MercadoPago exitoso:', response);
            response.initPoint;
            sessionStorage.setItem(
              'pendingPaymentId',
              String(response.paymentId),
            );
            const roomName = `${this.invoicePay()!.id}`;
            const url = `${environment.MERCADO_PAGO}?pref_id=${roomName}`;
            window.open(url, '_blank');
            // Aquí puedes manejar la respuesta de MercadoPago según tus necesidades
          },
          error: (error: IErrorGeneralResp) => {
            this._alertService.getAlert(
              'Error!!!',
              error.error.detail || 'Error al procesar el pago',
              'error',
            );
          },
        });
      }
    }
  }

  private getInvoicesMedhod() {
    this._invoicesService.getInvoicesByStore().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
      },
    });
  }

  private getInvoicesStore() {
    this._storesService.getStore(this.user?.storeId || 0).subscribe({
      next: (store) => {
        console.log(store);
        this.infoStoreIntifraud.set(store);
      },
    });
  }

  openModal() {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
  openConfirModal() {
    this.isModalOpen.set(false);
    this.isModalConfirOpen.set(true);
  }
  closeConfirModal() {
    this.isModalConfirOpen.set(false);
  }
}
