import { Component } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { storeMock } from '@app/mock/store.mock';
import { SearchComponent } from '@app/components/search/search.component';
import { CardStores } from '@app/interfaces/card.interface';

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
