import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { isReportStore } from '@app/mock/revenue.mock';
import {
  rolsCreateMock,
  userActionsMock,
} from '@app/mock/rol.mock';
import { SolesPipe } from '@app/pipes/soles.pipe';

@Component({
  selector: 'tyn-panel-page',
  imports: [DatePipe, SolesPipe],
  templateUrl: './panel-page.component.html',
})
export default class PanelPageComponent {
  _router = inject(Router);


  rolLists: any = [];
  userActions: any = [];
  userConects: any = [];
  ganancias: any = [];

  constructor() {
    const rolsCreate: any = [...rolsCreateMock];
    const userActions: any = [...userActionsMock];
    const userConectados: any = [...userActionsMock];

    this.rolLists = [...rolsCreate.splice(0, 3)];
    this.userActions = [...userActions.splice(0, 3)];
    this.userConects = [...userConectados.splice(0, 3)];
    this.ganancias = [...isReportStore];
  }
  routeLink(link: string) {
    this._router.navigate([`/admin/${link}`]);
  }
}
