import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { productMock } from '@app/mock/product.mock';
import { CreateCreation } from '@app/services/stores/create-creation.service';

@Component({
  selector: 'tyn-products-store-page',
  imports: [ProductDetailCardComponent],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent {
  productMock = productMock;
  constructor(public createCreation: CreateCreation) {}
}
