import { Component } from '@angular/core';
import { gananciasMock, rolsCreateMock, userActionsMock, userConectadosMock } from '@app/mock/rol.mock';

@Component({
  selector: 'tyn-panel-page',
  imports: [],
  templateUrl: './panel-page.component.html',
})
export default class PanelPageComponent {
  rolList = rolsCreateMock;
  userAction = userActionsMock;
  userConect =userConectadosMock;
  ganancias = gananciasMock;

}
