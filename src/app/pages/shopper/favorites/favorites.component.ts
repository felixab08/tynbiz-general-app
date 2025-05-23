import { Component } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { storeMock } from '@app/mock/store.mock';
import { CardStores } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-favorites',
  imports: [StoresCardComponent, FormsModule, CommonModule],
  templateUrl: './favorites.component.html',
})
export default class FavoritesComponent {
  cardStores: CardStores[] = storeMock;
}
