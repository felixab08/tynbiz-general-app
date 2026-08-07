import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tyn-card-contact-store-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './card-contact-store-page.component.html',
})
export class CardContactStorePageComponent {
  listContact = input.required<any>();
}
