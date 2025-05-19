import { Component, input } from '@angular/core';
import { CardStore } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-store-card',
  imports: [],
  templateUrl: './store-card.component.html',
})
export class StoreCardComponent {
  listCard = input.required<CardStore[]>();
}
