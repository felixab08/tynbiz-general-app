import { Component, inject, signal } from '@angular/core';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { productMock } from '@app/mock/product.mock';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';
import { ProductsStoreService } from '@app/services/stores/products-store.service';
import { FilterComponent } from '@app/components/filter/filter.component';
import { PaginationComponent } from '@app/components/pagination/pagination.component';

@Component({
  selector: 'tyn-products-list-page',
  imports: [ProductDetailCardComponent, FilterComponent, PaginationComponent],
  templateUrl: './products-list-page.html',
})
export class ProductsListPage {
  private _productsStoreService = inject(ProductsStoreService);
  _linkService = inject(LinkParamService);

  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: false,
    selectShow: false,
    filterSelectList: [],
  });

  nextPagePrefet(nextPage: number | string) {
    this._productsStoreService.prefetchIssue(nextPage);
  }
  productsResource = this._productsStoreService.ProductsByStoreQuery;
  constructor(public createCreation: CreateCreation) {}
}
