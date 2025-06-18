import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  gananciasMock,
  rolsCreateMock,
  userActionsMock,
  userConectadosMock,
} from '@app/mock/rol.mock';

@Component({
  selector: 'tyn-panel-page',
  imports: [],
  templateUrl: './panel-page.component.html',
})
export default class PanelPageComponent {
  _router = inject(Router);

  rolList = rolsCreateMock.splice(0, 3);
  userAction = userActionsMock.splice(0, 3);
  userConect = userConectadosMock.splice(0, 3);
  ganancias = gananciasMock;

  routeLink(link: string) {
    this._router.navigate([`/admin/${link}`]);
  }
}
