import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  output,
  effect,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { ICalendar } from '@app/interfaces';
import { CalendarService } from '@app/services/stores/calendar.service';

import { Horaries } from '../horaries/horaries';
import { ServicesDurationHorary } from '../services-duration-horary/services-duration-horary';
import { SpecialDates } from '../special-dates/special-dates';

@Component({
  selector: 'tyn-create-calendar-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Horaries,
    ServicesDurationHorary,
    SpecialDates,
  ],
  templateUrl: './create-calendar-modal.html',
})
export class CreateCalendarModal {
  calendarService = inject(CalendarService);
  private fb = inject(FormBuilder);

  visible = input(false);
  selectedCalendar = input<ICalendar>();

  close = output<void>();
  save = output<any>();

  @ViewChild(Horaries) horariesComp!: Horaries;
  @ViewChild(SpecialDates) specialDatesComp!: SpecialDates;

  selectedTab: 'horary' | 'specialDates' | 'appointmentDuration' = 'horary';

  form: FormGroup = this.fb.group({
    description: [''],
    slotDurationMinutes: [30],
    status: ['ACTIVE'],
    bookingWindowDays: [1],
    bookingWindowType: ['CALENDAR_DAYS'],
    maxAppointmentsPerDay: [10],
    daySchedules: this.fb.array([]),
    dateOverrides: this.fb.array([]),
  });

  private calendarEffect = effect(() => {
    const cal = this.selectedCalendar();

    if (!cal) return;

    this.form.patchValue({
      slotDurationMinutes: cal.slotDurationMinutes,
      status: cal.status,
      maxAppointmentsPerDay: cal.maxAppointmentsPerDay,
    });

    this.setFormArray('daySchedules', cal.daySchedules);
    this.setFormArray('dateOverrides', cal.dateOverrides);
  });

  setFormArray(key: string, values: any[]) {
    const formArray = this.form.get(key) as FormArray;
    formArray.clear();

    if (values?.length) {
      values.forEach((v) => formArray.push(this.fb.group({ ...v })));
    }
  }

  private timeStringToObj(time: string) {
    if (!time || time === '--:--') {
      return { hour: 0, minute: 0, second: 0, nano: 0 };
    }
    const [hour, minute] = time.split(':').map(Number);
    return { hour, minute, second: 0, nano: 0 };
  }

  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 10000);
  }

  private mapDaySchedules(data: any[]) {
    return data
      .filter((d: any) => d.status)
      .map((d: any) => ({
        id: typeof d.id === 'number' && !isNaN(d.id) ? d.id : this.generateId(),
        dayOfWeek: (d.dia || '').toUpperCase(),
        morningStart: this.timeStringToObj(d.mornDesde),
        morningEnd: this.timeStringToObj(d.mornHasta),
        afternoonStart: this.timeStringToObj(d.aftDesde),
        afternoonEnd: this.timeStringToObj(d.aftHasta),
        isWorkDay: d.status,
      }));
  }

  private mapDateOverrides(list: any[]) {
    return list.map((d: any) => ({
      id: typeof d.id === 'number' && !isNaN(d.id) ? d.id : this.generateId(),
      overrideDate: d.overrideDate || '',
      morningStart: this.timeStringToObj(d.mornDesde),
      morningEnd: this.timeStringToObj(d.mornHasta),
      afternoonStart: this.timeStringToObj(d.aftDesde),
      afternoonEnd: this.timeStringToObj(d.aftHasta),
      isDayOff: d.ifDayOff,
      reason: d.nombre || '',
    }));
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const horarios = this.horariesComp?.getData();
    const fechasEspeciales = this.specialDatesComp?.getData();

    const daySchedules = this.mapDaySchedules(Object.values(horarios || {}));
    const dateOverrides = this.mapDateOverrides(
      fechasEspeciales?.fechasEspeciales || [],
    );

    const original = this.selectedCalendar();

    const payload: Partial<ICalendar> = {
      ...this.form.value,
      daySchedules,
      dateOverrides,
    };

    console.log('Payload enviado a CalendarService:', payload);

    this.calendarService.putCalendarConfig(payload as ICalendar).subscribe({
      next: () => {
        this.save.emit(payload);
      },
      error: (err) => {
        console.error('Error al guardar calendario', err);
      },
    });
  }
}
