import { Component } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardStores } from '../../interfaces/card.interface';
import { storeMock } from '@app/mock/store.mock';

@Component({
  selector: 'tyn-favorites',
  imports: [StoresCardComponent, FormsModule, CommonModule, ],
  templateUrl: './favorites.component.html',
})
export default class FavoritesComponent {
  cardStores: CardStores[] = storeMock;
 }
