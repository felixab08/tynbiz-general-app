import { Component, input } from '@angular/core';

@Component({
  selector: 'tyn-simple-card',
  imports: [],
  templateUrl: './simple-card.component.html',
})
export class SimpleCardComponent {
  isCardValue = input.required<any>();
}
