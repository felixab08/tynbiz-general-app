import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tyn-card-contact-store-page',
  imports: [CommonModule],
  templateUrl: './card-contact-store-page.component.html',
})
export class CardContactStorePageComponent {
  listContact = input.required<any>();
}
