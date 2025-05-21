import { Component, input } from '@angular/core';
import { CardStores } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-stores-card',
  imports: [],
  templateUrl: './stores-card.component.html',
})
export class StoresCardComponent {
  listStores = input.required<CardStores[]>();
}
