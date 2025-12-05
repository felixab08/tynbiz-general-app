import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@app/components/pagination/pagination.service';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { productMock } from '@app/mock/product.mock';
import { ProductoService } from '@app/services/admin/producto.service';

@Component({
  selector: 'tyn-products-store-page',
  imports: [ProductDetailCardComponent],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent {
  private _productoService = inject(ProductoService);
  _paginationService = inject(PaginationService);

  productoResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    loader: ({ request }) => {
      return (
        this._productoService.getPersona({
          page: request.page,
          size: request.size,
        }) || {}
      );
    },
  });
}
