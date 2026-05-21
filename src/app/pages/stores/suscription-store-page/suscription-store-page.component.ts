import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AlertService,
  InvoicesService,
  MercadoPagoService,
  StoreService,
  StoresService,
  SuscriptionService,
} from '@app/services';
import {
  AllowedPlan,
  IErrorGeneralResp,
  IMeSuscriptionStore,
  InvoicesPayResp,
  InvoicesResp,
  IStoresResp,
  ISuscriptionEligibility,
} from '@app/interfaces';
import { User } from '@app/auth/interfaces/user.interface';
import { PaymentsMapper } from './payments.mapper';

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
  suscriptionStore = signal<IMeSuscriptionStore | null>(null);
  listSuscription = signal<ISuscriptionEligibility | null>(null);
  selectSusctiptionChange = signal<AllowedPlan | null>(null);
  private _storesService = inject(StoresService);
  private _mercadoPagoService = inject(MercadoPagoService);
  private _alertService = inject(AlertService);
  private _suscriptionSrv = inject(SuscriptionService);
  private _invoicesService = inject(InvoicesService);

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
    this.getSuscriptionInvoices();
  }

  paySuscription() {
    if (this.invoicePay() && this.infoStoreIntifraud()) {
      const paymentData = PaymentsMapper.mapInvoiceToPaymentMethod(
        this.invoicePay()!,
        this.infoStoreIntifraud()!,
        this.invoicePayMethod()!,
      );
      if (paymentData && this.invoicePayMethod() === 'Niubiz') {
        this._invoicesService.postInvoicePayment(paymentData).subscribe({
          next: (response) => {
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
            sessionStorage.setItem(
              'pendingPaymentId',
              String(response.paymentId),
            );
            window.open(response.checkoutUrl, '_blank');
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

  private getSuscriptionInvoices() {
    this._suscriptionSrv.getMeSuscriptionByStore().subscribe({
      next: (suscription) => {
        this.suscriptionStore.set(suscription);
      },
      error: (error: IErrorGeneralResp) => {
        this._alertService.getAlert(
          'Error!!!',
          error.error.detail || 'Error en obtener la suscripción',
          'error',
        );
      },
    });
  }

  private getListSuscriptionInvoices() {
    this._suscriptionSrv.getSuscriptionByEligilitiStore().subscribe({
      next: (list) => {
        this.listSuscription.set(list);
      },
      error: (error: IErrorGeneralResp) => {
        this._alertService.getAlert(
          'Error!!!',
          error.error.detail || 'Error en obtener la lista de suscripciones',
          'error',
        );
      },
    });
  }

  private getInvoicesStore() {
    this._storesService.getStore(this.user?.storeId || 0).subscribe({
      next: (store) => {
        this.infoStoreIntifraud.set(store);
      },
    });
  }

  changeSuscription(planSelected: AllowedPlan) {
    this.selectSusctiptionChange.set(planSelected);
  }

  putChangePlanStore(planId: number) {
    this._suscriptionSrv.putChangePlanStore(planId).subscribe({
      next: () => {
        this.closeConfirModal();
      },
      error: (error: IErrorGeneralResp) => {
        this._alertService.getAlert(
          'Error!!!',
          error.error.detail || 'Error al cambiar el plan',
          'error',
        );
      },
    });
  }

  openModalPlan() {
    this.getListSuscriptionInvoices();
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
