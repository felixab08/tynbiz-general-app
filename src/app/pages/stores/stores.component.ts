import { Component } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { CardStores } from '../../interfaces/card.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../components/search/search.component';
import { storeMock } from '@app/mock/store.mock';

@Component({
  selector: 'tyn-stores',
  imports: [StoresCardComponent, FormsModule, CommonModule, SearchComponent],
  templateUrl: './stores.component.html',
})
export default class StoresComponent {
  cardStores: CardStores[] = storeMock;
  valueSearch(event: string[]) {
    console.log(event);
  }
}
