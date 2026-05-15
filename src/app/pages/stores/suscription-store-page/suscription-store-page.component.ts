import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InvoicesService, StoreService, StoresService } from '@app/services';
import { InvoicesResp, IStoresResp } from '@app/interfaces';
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

  _invoicesService = inject(InvoicesService);
  _storesService = inject(StoresService);

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
      );
      console.log(paymentData);
    }
  }

  getInvoicesMedhod() {
    this._invoicesService.getInvoicesByStore().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
      },
    });
  }
  getInvoicesStore() {
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
