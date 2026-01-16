import { Component, effect, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselProductsCreation } from '@app/components/carousel-products-creation/carousel-products-creation.component';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { CreateCreation } from '@app/services/stores/create-creation.service';
type CreationStep = 'products' | 'details';
@Component({
  selector: 'tyn-create-creation-store-page',
  imports: [CarouselProductsCreation, ProductDetailCardComponent],
  templateUrl: './create-creation-store-page.component.html',
})
export default class CreateCreationStorePage {

  step = signal<CreationStep>('products');
  publicationType = signal<'solo' | 'vivo'>('solo');
  scheduleEnabled = signal(false);

  showAlert = signal(false);
  constructor(
    public createCreation: CreateCreation,
    private router: Router
  ) {
    effect(() => {
      if (this.createCreation.count() === 0) {
        setTimeout(() => this.showAlert.set(true),500);
      } else {
        this.showAlert.set(false);
      }
    });
  }

  goToProducts() {
    this.router.navigate(['/stores/products']);
  }
  nextStep() {
    if (this.createCreation.count() === 0) return;
    this.step.set('details');
  }

  backToProducts() {
    this.step.set('products');
  }
  onPublicationChange(value: string) {
    this.publicationType.set(value as 'solo' | 'vivo');

    // resetear toggle y fecha/hora si cambia a "solo"
    if (value === 'solo') {
      this.scheduleEnabled.set(false);
    }
  }

  toggleSchedule() {
    this.scheduleEnabled.update(v => !v);
  }

}
