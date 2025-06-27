import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { CreationStoreTableCreationPageComponent } from './creation-store-table-creation-page/creation-store-table-creation-page.component';
import { creationStoreMock } from '@app/mock/creationsStore.mock';

@Component({
  selector: 'tyn-creation-store-page',
  imports: [CommonModule, CreationStoreTableCreationPageComponent],
  templateUrl: './creation-store-page.component.html',
})
export default class CreationStorePageComponent {
  selectedTab: 'published' | 'offers' | 'live' = 'published'
  cardCrea = creationStoreMock;
 }
