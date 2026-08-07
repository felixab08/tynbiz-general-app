import { Component, signal, ViewChild, AfterViewInit, input, ChangeDetectionStrategy } from '@angular/core';
import { DaySchedule } from '@app/interfaces';
import { HoraryCreate } from '../horary-create/horary-create';

@Component({
  selector: 'tyn-horaries',
  imports: [HoraryCreate],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './horaries.html',
})
export class Horaries implements AfterViewInit {
  daySchedules = input<DaySchedule[] | undefined>();
  @ViewChild(HoraryCreate) horaryCreateComp!: HoraryCreate;

  getData() {
    return this.horaryCreateComp?.myForm?.value ?? null;
  }

  ngAfterViewInit() {
  }
}
