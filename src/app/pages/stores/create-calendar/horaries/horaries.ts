import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { HoraryCreate } from '../horary-create/horary-create';

@Component({
  selector: 'tyn-horaries',
  imports: [HoraryCreate],
  templateUrl: './horaries.html',
})
export class Horaries implements AfterViewInit {
  activeSchedule = signal<boolean>(true);
  @ViewChild(HoraryCreate) horaryCreateComp!: HoraryCreate;

  getData() {
    return this.horaryCreateComp?.myForm?.value ?? null;
  }

  ngAfterViewInit() {
  }
}
