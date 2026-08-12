import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CardContactStorePageComponent } from './card-contact-store-page/card-contact-store-page.component';
import { contactMock } from '@app/mock/contact.mock';
import { ContactService, LinkParamService } from '@app/services';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@app/components';

@Component({
  selector: 'tyn-contact-store-page',
  imports: [CardContactStorePageComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './contact-store-page.component.html',
})
export default class ContactStorePageComponent {
  _contactService = inject(ContactService);
  _paginationService = inject(LinkParamService);

  listContact = contactMock;

  contactResorce = rxResource({
    params: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    stream: ({ params }) => {
      return (
        this._contactService.getContactByStore({
          page: params.page,
          size: params.size,
        }) || {}
      );
    },
  });
}
