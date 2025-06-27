import { Component, computed, input } from '@angular/core';
import { CreationesStoreCardCreationPageComponent } from '../creationes-store-card-creation-page/creationes-store-card-creation-page.component';
import { CommonModule } from '@angular/common';
import { creationStore } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-creation-store-table-creation-page',
  imports: [CreationesStoreCardCreationPageComponent, CommonModule],
  templateUrl: './creation-store-table-creation-page.component.html',
})
export class CreationStoreTableCreationPageComponent {
  listCreation = input.required<creationStore[]>();
  tipeTable = input<'published' | 'offers' | 'live'>('published');
  Creation: any = true;

  openDropdownIndex: number | null = null;

  toggleDropdown(creation: any) {
    this.Creation = creation;
    this.openDropdownIndex = this.openDropdownIndex === creation.id ? null : creation.id;
  }

  selectedList = computed(() => {
    const type = this.tipeTable();
    const list = this.listCreation();
    switch (type) {
      case 'offers':
        return list.filter(item => item.offer === true);
      case 'live':
        return list.filter(item => item.vivo === true);
      case 'published':
      default:
        return list;
    }
  });
}
