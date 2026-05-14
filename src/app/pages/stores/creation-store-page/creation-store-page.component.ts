import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { CreationStoreTableCreationPageComponent } from './creation-store-table-creation-page/creation-store-table-creation-page.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';

@Component({
  selector: 'tyn-creation-store-page',
  imports: [CommonModule, CreationStoreTableCreationPageComponent],
  templateUrl: './creation-store-page.component.html',
})
export default class CreationStorePageComponent {
  selectedTab: 'PUBLICADOS' | 'OFERTAS' | 'EN_VIVO' = 'PUBLICADOS';
}
