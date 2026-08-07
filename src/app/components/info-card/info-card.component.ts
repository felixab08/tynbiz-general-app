import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CardInfo } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-info-card',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './info-card.component.html',
})
export class InfoCardComponent {
  listCard = input.required<CardInfo[]>();
}
