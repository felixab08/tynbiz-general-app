import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { SolesPipe } from '@app/pipes/soles.pipe';

@Component({
  selector: 'tyn-simple-card',
  imports: [SolesPipe],
  templateUrl: './simple-card.component.html',
})
export class SimpleCardComponent {
  isCardValue = input.required<any>();
}
