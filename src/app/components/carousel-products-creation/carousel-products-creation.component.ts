import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IProduct, ProductCreation } from '@app/interfaces';
import { Product } from '@app/interfaces/card.interface';
import { initCarousels } from 'flowbite';

@Component({
  selector: 'tyn-carousel-products-creation',
  imports: [CommonModule],
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
