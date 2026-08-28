import {
  Component,
  inject,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Cardcreations } from '@app/interfaces/card.interface';
import { CommonModule } from '@angular/common';
import { initCarousels } from 'flowbite';
import { ProductDetailCardComponent } from '../product-detail-card/product-detail-card.component';
import { CarouselProductsCreation } from '../carousel-products-creation/carousel-products-creation.component';
import { ICreationContent, ItemCreation } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes/not-image.pipe';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { AlertService, StoreService } from '@app/services';
import { User } from '@app/auth/interfaces/user.interface';
@Component({
  selector: 'tyn-creation-card',
  imports: [
    CommonModule,
    ProductDetailCardComponent,
    CarouselProductsCreation,
    NotImagePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './creation-card.component.html',
})
export class CreationCardComponent {
  listCreation = input.required<ICreationContent>();
  isModalOpen = signal(false);
  selectedcreations: ItemCreation | null = null;
  _router = inject(Router);
  private _storeService = inject(StoreService);
  refreshToken: string | null = null;
  _alertService = inject(AlertService);

  public user: User | undefined;
  user$ = this._storeService.user.asObservable();

  constructor() {
    this._storeService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngAfterViewInit(): void {
    initCarousels(); // inicializa el carrusel de Flowbite
    this._storeService.refreshTokenSubject.subscribe((refreshToken) => {
      this.refreshToken = refreshToken;
    });
  }
  openModal(creations: ItemCreation) {
    this.selectedcreations = creations;
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
  createJitsi() {
    if (!this.user) {
      this._storeService.isLoginSubject.next(true);
      this.isModalOpen.set(false);
      this._alertService.getAlert(
        'Alerta',
        'Inicia sesión para poder acceder a la sala de video',
        'warning',
      );
    } else {
      const url =
        `${this.selectedcreations?.videoRoomUrl}` +
        `?code=${this.refreshToken}`;
      window.open(url, '_blank');
    }
  }
}
