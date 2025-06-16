import { Component } from '@angular/core';
import { Cardcreations } from '@app/interfaces/card.interface';
import { creationMock } from '@app/mock/creations.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreationCardComponent } from '@app/components/creation-card/creation-card.component';
import { SearchComponent } from '@app/components/search/search.component';
@Component({
  selector: 'tyn-creations',
  imports: [CreationCardComponent, FormsModule, CommonModule, SearchComponent],
  templateUrl: './creations.component.html',
})
export default class CreationsComponent {
  cardCrea: Cardcreations[] = creationMock;
  valueSearch(event: string[]) {
    console.log(event);
  }
}
