import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  IProduct,
  IProductStoreResp,
  ProductContent,
  ProductoContent,
} from '@app/interfaces';
import { Product } from '@app/interfaces/card.interface';
import { NotImagePipe } from '@app/pipes/not-image.pipe';

@Component({
  selector: 'tyn-product-detail-card',
  imports: [NotImagePipe, CommonModule],
  templateUrl: './product-detail-card.component.html',
})
export class ProductDetailCardComponent {
  listProduct = input.required<ProductContent>();
}
