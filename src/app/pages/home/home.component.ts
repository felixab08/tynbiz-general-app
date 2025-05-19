import { Component } from '@angular/core';
import { StoreCardComponent } from '../../components/store-card/store-card.component';

@Component({
  selector: 'tyn-home',
  imports: [StoreCardComponent],
  templateUrl: './home.component.html',
})
export default class HomeComponent {}
