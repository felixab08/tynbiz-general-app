import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { productMock } from '@app/mock/product.mock';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';
import { ProductsStoreService } from '@app/services/stores/products-store.service';
import { FilterComponent } from '@app/components/filter/filter.component';
import { PaginationComponent } from '@app/components/pagination/pagination.component';

@Component({
  selector: 'tyn-products-list-page',
  imports: [ProductDetailCardComponent],
  templateUrl: './products-list-page.html',
})
export class ProductsListPage {
  private _productsStoreService = inject(ProductsStoreService);
  _linkService = inject(LinkParamService);
  productsResource = input<any>(undefined);
  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: false,
    selectShow: false,
    filterSelectList: [],
  });

  // productsResource = rxResource({
  //   request: () => ({
  //     page: this._linkService.currentPage() - 1,
  //     size: this._linkService.currentSize(),
  //     searchTerm: this._linkService.currentSearchTerm(),
  //   }),
  //   loader: ({ request }) => {
  //     return (
  //       this._productsStoreService.getProductsByStore({
  //         page: request.page,
  //         size: request.size,
  //         searchTerm: request.searchTerm,
  //       }) || {}
  //     );
  //   },
  // });

  constructor(public createCreation: CreateCreation) {
    if (this.productsResource()) {
      console.log(this.productsResource());
    }
  }
}
