import { Component } from '@angular/core';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { productMock } from '@app/mock/product.mock';

@Component({
  selector: 'tyn-products-store-page',
  imports: [ProductDetailCardComponent],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent {
  products = productMock;
}
