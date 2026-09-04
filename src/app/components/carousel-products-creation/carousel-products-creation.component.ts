import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ProductCreation } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes';
import { initCarousels } from 'flowbite';

@Component({
  selector: 'tyn-carousel-products-creation',
  imports: [CommonModule, NotImagePipe],
  templateUrl: './carousel-products-creation.component.html',
})
export class CarouselProductsCreation {
  listProduct = input.required<ProductCreation[]>();

  products: ProductCreation[] = [];

  private initialized = false;

  ngAfterViewChecked(): void {
    const currentProducts = this.listProduct();

    if (currentProducts.length > 0) {
      if (this.products !== currentProducts) {
        this.products = currentProducts;
        this.initialized = false;
      }

      if (!this.initialized) {
        this.initialized = true;
        setTimeout(() => {
          initCarousels();
        });
      }
    }
  }
}
