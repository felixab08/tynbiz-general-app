import { Component, input } from '@angular/core';
import { CarouselProductsCreation } from "@app/components/carousel-products-creation/carousel-products-creation.component";
import { creationStoreMock } from '@app/mock/creationsStore.mock';
import { ProductDetailCardComponent } from "@app/components/product-detail-card/product-detail-card.component";

@Component({
  selector: 'tyn-create-creation-store-page',
  imports: [CarouselProductsCreation, ProductDetailCardComponent],
  templateUrl: './create-creation-store-page.component.html',
})
export default class CreateCreationStorePage {
  listCreation = creationStoreMock[5];
}
