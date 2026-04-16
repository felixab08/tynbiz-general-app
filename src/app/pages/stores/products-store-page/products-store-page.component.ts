import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopifyPage } from './shopify-page/shopify-page';
import { WordpressPage } from './wordpress-page/wordpress-page';

@Component({
  selector: 'tyn-products-store-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopifyPage, WordpressPage],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent {}
