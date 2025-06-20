import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  gananciasMock,
  rolsCreateMock,
  userActionsMock,
} from '@app/mock/rol.mock';

@Component({
  selector: 'tyn-panel-page',
  imports: [DatePipe],
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
    this.ganancias = [...gananciasMock];
  }
  routeLink(link: string) {
    this._router.navigate([`/admin/${link}`]);
  }
}
