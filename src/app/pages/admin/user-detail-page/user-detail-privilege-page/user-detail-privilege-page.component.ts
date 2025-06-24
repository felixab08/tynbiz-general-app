import { Component, input } from '@angular/core';
import { menuAdminMock } from '@app/mock/menu.mock';

@Component({
  selector: 'tyn-user-detail-privilege-page',
  imports: [],
  templateUrl: './user-detail-privilege-page.component.html',
})
export class UserDetailPrivilegePageComponent {
  menuAdmin = menuAdminMock.map((item: any) => ({ ...item, checked: false }));
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
  checkAll(value?: any) {
    if (value.target.checked) {
      this.menuAdmin.forEach((item: any) => {
        item.checked = true;
      });
    } else {
      this.menuAdmin.forEach((item: any) => {
        item.checked = false;
      });
    }
  }
}
