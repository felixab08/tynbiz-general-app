import { Component } from '@angular/core';
import { CardContactStorePageComponent } from './card-contact-store-page/card-contact-store-page.component';
import { contactMock } from '@app/mock/contact.mock';

@Component({
  selector: 'tyn-contact-store-page',
  imports: [CardContactStorePageComponent],
  templateUrl: './contact-store-page.component.html',
})
export default class ContactStorePageComponent {
  listContact = contactMock;
}
