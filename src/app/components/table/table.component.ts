import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { resquestDemoListMock } from '@app/mock/resquet-demo-list.mock';
import { userConectadosMock } from '@app/mock/rol.mock';

@Component({
  selector: 'tyn-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() dataSource: any[] = [...resquestDemoListMock];
  headerTable: any[] = [
    'storeName',
    'storeSite',
    'requestDate',
    'storeEmail',
    'storeStatusService',
  ];
  @Input() displayedColumns: string[] = [
    'N°',
    'Usuario',
    'Rol',
    'Estado',
    'Dos Pasos',
    'Fecha Registro',
    'Acciones',
  ];
  constructor() {
    // this.headerTable = this.dataSource.map((objeto: any) =>
    //   Object.keys(objeto)
    // )[0];
    console.log('Felix:::::>', this.headerTable);
  }
}
