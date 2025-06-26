import { Component, input } from '@angular/core';
import { Product } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-product-detail-card',
  imports: [],
  templateUrl: './product-detail-card.component.html',
})
export class ProductDetailCardComponent {
  listProduct = input.required<any>();
}
