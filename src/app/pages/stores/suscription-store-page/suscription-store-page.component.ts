import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tyn-suscription-store-page',
  imports: [CommonModule],
  templateUrl: './suscription-store-page.component.html',
})
export default class SuscriptionStorePageComponent {
    selectedTab: 'plans' | 'paymentMethod' | 'billingHistory' = 'plans'
    isModalOpen = signal(false);
    isModalConfirOpen = signal(false);
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
