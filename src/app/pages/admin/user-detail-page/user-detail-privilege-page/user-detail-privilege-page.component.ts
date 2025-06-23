import { Component, input } from '@angular/core';

@Component({
  selector: 'tyn-user-detail-privilege-page',
  imports: [],
  templateUrl: './user-detail-privilege-page.component.html',
})
export class UserDetailPrivilegePageComponent {
  userInfo = input.required<any>();
  specialPrivileges = [
    {
      id: 1,
      name: 'Editar',
      checked: true,
    },
    {
      id: 2,
      name: 'Eliminar',
      checked: true,
    },
    {
      id: 3,
      name: 'Crear',
      checked: true,
    },
    {
      id: 4,
      name: 'Exportar',
      checked: false,
    },
    {
      id: 5,
      name: 'Importar',
      checked: false,
    },
  ];
}
