import { Component, input, signal } from '@angular/core';
import { Cardcreations } from '@app/interfaces/card.interface';
import { CommonModule } from '@angular/common';
import { initCarousels } from 'flowbite';
import { ProductDetailCardComponent } from '../product-detail-card/product-detail-card.component';
import { CarouselProductsCreation } from '../carousel-products-creation/carousel-products-creation.component';
import { ICreationContent, ItemCreation } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes/not-image.pipe';
import { environment } from '@environments/environment';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'tyn-creation-card',
  imports: [
    CommonModule,
    ProductDetailCardComponent,
    CarouselProductsCreation,
    NotImagePipe,
    RouterLink,
  ],
  templateUrl: './creation-card.component.html',
})
export class CreationCardComponent {
  listCreation = input.required<ICreationContent>();
  isModalOpen = signal(false);
  selectedcreations: ItemCreation | null = null;
  ngAfterViewInit(): void {
    console.log(this.listCreation());

    initCarousels(); // inicializa el carrusel de Flowbite
  }
  openModal(creations: ItemCreation) {
    console.log(creations);

    this.selectedcreations = creations;
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
  createJitsi() {
    const roomName = `${this.selectedcreations?.id}`;
    const url = `${environment.JITSI_URL}/${roomName}`;
    window.open(url, '_blank');
  }
}
