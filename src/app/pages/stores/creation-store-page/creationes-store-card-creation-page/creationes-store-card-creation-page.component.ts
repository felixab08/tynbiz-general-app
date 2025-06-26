import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tyn-creationes-store-card-creation-page',
  imports: [CommonModule],
  templateUrl: './creationes-store-card-creation-page.component.html',
})
export class CreationesStoreCardCreationPageComponent {
  creation = input.required<any>();
}
