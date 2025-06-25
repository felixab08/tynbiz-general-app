import { Component } from '@angular/core';
import { productMock } from '@app/mock/product.mock';

@Component({
  selector: 'tyn-products-store-page',
  imports: [],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent {
  products = productMock;
}
