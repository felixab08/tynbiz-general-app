import { Component, signal } from '@angular/core';
import { IHorary } from '@app/interfaces';
import { HoraryCreate } from '../horary-create/horary-create';
import { dataHours } from './horaries.database';
import { NgClass } from '@angular/common';

@Component({
  selector: 'tyn-horaries',
  imports: [HoraryCreate, NgClass],
  templateUrl: './horaries.html',
})
export class Horaries {
  listHorarioAtendimiento: IHorary[] = dataHours;
  activeSchedule = signal<boolean>(true);

  selectHour(horary: IHorary) {
    this.listHorarioAtendimiento = this.listHorarioAtendimiento.map((hour) =>
      hour.dia === horary.dia ? { ...hour, ...horary } : hour,
    );
    this.activeSchedule.set(false);
    console.log(horary);
  }
  saveHorarySelect() {
    let list = this.listHorarioAtendimiento.filter(
      (hour) => hour.status === true,
    );
    console.log(list);
  }
}
