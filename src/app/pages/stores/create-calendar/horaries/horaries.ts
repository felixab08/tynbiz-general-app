import { Component, signal } from '@angular/core';
import { HoraryCreate } from '../horary-create/horary-create';

@Component({
  selector: 'tyn-horaries',
  imports: [HoraryCreate],
  templateUrl: './horaries.html',
})
export class Horaries {
  activeSchedule = signal<boolean>(true);
}
