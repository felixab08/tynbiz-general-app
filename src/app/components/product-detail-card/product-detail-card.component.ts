import { Component, input } from '@angular/core';
import { ProductoContent } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes/not-image.pipe';

@Component({
  selector: 'tyn-product-detail-card',
  imports: [NotImagePipe],
  templateUrl: './product-detail-card.component.html',
})
export class ProductDetailCardComponent {
  listProduct = input.required<ProductoContent>();
}
