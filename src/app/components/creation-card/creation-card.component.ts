import { Component, input, signal } from '@angular/core';
import { Cardcreations } from '@app/interfaces/card.interface';
import { CommonModule } from '@angular/common';
import { initCarousels } from 'flowbite';
import { ProductDetailCardComponent } from '../product-detail-card/product-detail-card.component';
@Component({
  selector: 'tyn-creation-card',
  imports: [CommonModule, ProductDetailCardComponent],
  templateUrl: './creation-card.component.html',
})
export class CreationCardComponent {
  listCreation = input.required<Cardcreations[]>();
  isModalOpen = signal(false);
  selectedcreations: any = true;
  ngAfterViewInit(): void {
    initCarousels(); // inicializa el carrusel de Flowbite
  }
  openModal(creations: any) {
    this.selectedcreations = creations;
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
}
