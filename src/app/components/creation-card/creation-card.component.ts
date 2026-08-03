import { Component, inject, input, signal } from '@angular/core';
import { Cardcreations } from '@app/interfaces/card.interface';
import { CommonModule } from '@angular/common';
import { initCarousels } from 'flowbite';
import { ProductDetailCardComponent } from '../product-detail-card/product-detail-card.component';
import { CarouselProductsCreation } from '../carousel-products-creation/carousel-products-creation.component';
import { ICreationContent, ItemCreation } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes/not-image.pipe';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { StoreService } from '@app/services';
@Component({
  selector: 'tyn-creation-card',
  imports: [
    CommonModule,
    ProductDetailCardComponent,
    CarouselProductsCreation,
    NotImagePipe,
  ],
  templateUrl: './creation-card.component.html',
})
export class CreationCardComponent {
  listCreation = input.required<ICreationContent>();
  isModalOpen = signal(false);
  selectedcreations: ItemCreation | null = null;
  _router = inject(Router);
  private _storeService = inject(StoreService);
  refreshToken: string | null = null;

  ngAfterViewInit(): void {
    initCarousels(); // inicializa el carrusel de Flowbite
    this._storeService.refreshTokenSubject.subscribe((refreshToken) => {
      this.refreshToken = refreshToken;
      console.log(this.refreshToken);
    });
  }
  openModal(creations: ItemCreation) {
    this.selectedcreations = creations;
    console.log(this.selectedcreations);

    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
  createJitsi() {
    // this._router.navigate([`/shop/jitsi/${this.listCreation().items[0].id}`]);
    const url =
      `${this.selectedcreations?.videoRoomUrl}` + `?code=${this.refreshToken}`;
    window.open(url, '_blank');
  }
}
