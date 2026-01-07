import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { productMock } from '@app/mock/product.mock';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';
import { ProductsStoreService } from '@app/services/stores/products-store.service';

@Component({
  selector: 'tyn-products-store-page',
  imports: [ProductDetailCardComponent],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent {
  private _productsStoreService = inject(ProductsStoreService);
  productMock = productMock;

  productsResource = rxResource({
    request: () => ({
      storeId: 1,
    }),
    loader: ({ request }) =>
      this._productsStoreService.getCompleteProductsByStore(request.storeId)
  });


  constructor(public createCreation: CreateCreation) {
  }
}
