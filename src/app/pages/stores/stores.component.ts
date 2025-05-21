import { Component } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { CardStores } from '../../interfaces/card.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'tyn-stores',
  imports: [StoresCardComponent, FormsModule, CommonModule, SearchComponent],
  templateUrl: './stores.component.html',
})
export default class StoresComponent {
  cardStores: CardStores[] = [
    {
      id: 1,
      nameStore: 'Linio',
      sitioStore: 'www.linio.com',
      logoStore: './assets/img/u23.png',
      linkStore: '#',
    },
    {
      id: 2,
      nameStore: 'Falabella',
      sitioStore: 'www.falabella.com',
      logoStore: './assets/img/u37.png',
      linkStore: '#',
    },
    {
      id: 3,
      nameStore: 'Linio',
      sitioStore: 'www.linio.com',
      logoStore: './assets/img/u23.png',
      linkStore: '#',
    },
    {
      id: 4,
      nameStore: 'Falabella',
      sitioStore: 'www.falabella.com',
      logoStore: './assets/img/u37.png',
      linkStore: '#',
    },
    {
      id: 5,
      nameStore: 'Linio',
      sitioStore: 'www.linio.com',
      logoStore: './assets/img/u23.png',
      linkStore: '#',
    },
    {
      id: 6,
      nameStore: 'Falabella',
      sitioStore: 'www.falabella.com',
      logoStore: './assets/img/u37.png',
      linkStore: '#',
    },
  ];
}
