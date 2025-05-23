import { Component, input, signal } from '@angular/core';
import { CardOffer } from '@app/interfaces/card.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'tyn-offer-card',
  imports: [CommonModule],
  templateUrl: './offer-card.component.html',
})
export class OfferCardComponent {
  listOffer = input.required<CardOffer[]>();
   isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
}
