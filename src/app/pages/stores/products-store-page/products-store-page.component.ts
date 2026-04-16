import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopifyPage } from './shopify-page/shopify-page';
import { WordpressPage } from './wordpress-page/wordpress-page';
import { WordpressService } from '@app/services/stores/wordpress.service';
import { ProductsListPage } from './products-list-page/products-list-page';

@Component({
  selector: 'tyn-products-store-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ShopifyPage,
    WordpressPage,
    ProductsListPage,
  ],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent {
  statusHandleIsPending = signal(true);
  _wordpressService = inject(WordpressService);
  productsResource = signal<any>(null);
  constructor() {
    // Opcional: verificar estado al cargar la página
    this.checkStatus();
  }

  checkStatus(): void {
    this._wordpressService.getWordpressStatus().subscribe({
      next: (res) => {
        alert(`Estado actual de WordPress: ${res.status}`);
        res.status === 'ACTIVE'
          ? this.statusHandleIsPending.set(true)
          : this.statusHandleIsPending.set(false);
        if (res.status === 'ACTIVE') {
          this.listProducts();
        }
      },
      error: () => {
        alert('Error al obtener el estado de WordPress');
      },
    });
  }

  listProducts(): void {
    this._wordpressService.getWordpressProducts().subscribe({
      next: (products: any) => {
        console.log('Productos obtenidos:', products);
        this.productsResource.set(products);
      },
      error: () => {
        alert('Error al obtener los productos de la tienda');
      },
    });
  }
}
