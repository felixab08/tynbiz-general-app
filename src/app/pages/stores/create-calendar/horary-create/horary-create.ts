import { Component, input } from '@angular/core';
import { IHorary } from '@app/interfaces';

@Component({
  selector: 'tyn-horary-create',
  imports: [],
  templateUrl: './horary-create.html',
})
export class HoraryCreate {
  horario = input.required<IHorary>();

  handleStatus() {
    this.horario().status = !this.horario().status;
  }
}
