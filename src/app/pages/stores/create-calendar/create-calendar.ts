import {
  Component,
  ViewChild,
  inject,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import {
  AngularMyDatePickerDirective,
  AngularMyDatePickerModule,
  IAngularMyDpOptions,
} from '@nodro7/angular-mydatepicker';

@Component({
  selector: 'tyn-create-calendar',
  imports: [AngularMyDatePickerModule],
  templateUrl: './create-calendar.html',
})
export default class CreateCalendar {
  handlerTurno = signal(false);
  turnoCreate = signal<any | null>(null);
  cdr = inject(ChangeDetectorRef);
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    inline: true,
  };
  listHorarioAtendimiento: any[] = [
    { id: 1, status: true, dia: 'Lunes', desde: '08:00', hasta: '18:00' },
    { id: 2, status: true, dia: 'Martes', desde: '08:00', hasta: '18:00' },
    { id: 3, status: true, dia: 'Miércoles', desde: '08:00', hasta: '18:00' },
    { id: 4, status: true, dia: 'Jueves', desde: '08:00', hasta: '18:00' },
    { id: 5, status: true, dia: 'Viernes', desde: '08:00', hasta: '18:00' },
    { id: 6, status: true, dia: 'Sábado', desde: '12:00', hasta: '16:30' },
    { id: 7, status: false, dia: 'Domingo', desde: '--', hasta: '--' },
  ];

  listHorarioTurno: any[] = [
    { id: 1, status: true, dia: 'Mañana', desde: '07:00', hasta: '12:00' },
    { id: 2, status: true, dia: 'Tarde', desde: '12:00', hasta: '18:00' },
  ];
  listDisabledDates: Array<{ year: number; month: number; day: number }> = [
    { year: 2024, month: 6, day: 10 },
  ];
  @ViewChild('dp', { static: true }) myDp!: AngularMyDatePickerDirective;

  ngOnInit(): void {
    this.onDisableUntilYesterday(true);
  }

  toggleCalendar(): void {
    this.cdr.detectChanges();
    this.myDp.toggleCalendar();
  }
  chageDate(event: any): void {
    console.log('date changed', event.singleDate);
    this.turnoCreate.set(event.singleDate.date);
    this.listDisabledDates.push(event.singleDate.date);
    this.handlerTurno.set(true);
  }
  getCopyOfOptions(): IAngularMyDpOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }
  onDisableUntilYesterday(checked: boolean) {
    let copy = this.getCopyOfOptions();
    let d: Date = new Date();
    d.setDate(d.getDate() - 1);
    copy.disableUntil = checked
      ? { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
      : { year: 0, month: 0, day: 0 };
    this.myDatePickerOptions = copy;
  }
  sendAgenda(): void {
    console.log('agenda enviada');
  }
  onDisableToday(checked: boolean): void {
    let copy = this.getCopyOfOptions();
    copy.disableDates = true ? this.listDisabledDates : [];
    this.myDatePickerOptions = copy;
    this.handlerTurno.set(false);
  }
}
