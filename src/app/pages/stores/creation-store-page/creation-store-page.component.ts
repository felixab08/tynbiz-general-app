import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CreationesStoreCardCreationPageComponent } from './creationes-store-card-creation-page/creationes-store-card-creation-page.component';
import { creationMock } from '@app/mock/creations.mock';

@Component({
  selector: 'tyn-creation-store-page',
  imports: [CommonModule, CreationesStoreCardCreationPageComponent],
  templateUrl: './creation-store-page.component.html',
})
export default class CreationStorePageComponent {
  selectedTab: string = 'published';
  cardCrea = creationMock;

 }
