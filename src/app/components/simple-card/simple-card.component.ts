import { CurrencyPipe } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SolesPipe } from '@app/pipes/soles.pipe';

@Component({
  selector: 'tyn-simple-card',
  imports: [SolesPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './simple-card.component.html',
})
export class SimpleCardComponent {
  isCardValue = input.required<any>();
  tipeCant = input<'monto' | 'cantidad'>('cantidad');
}
