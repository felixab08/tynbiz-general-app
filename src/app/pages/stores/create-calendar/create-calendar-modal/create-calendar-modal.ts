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
  @ViewChild(ServicesDurationHorary)
  servicesDurationComp!: ServicesDurationHorary;

  private readonly appointmentsStorageKey = 'calendarAppointments';

  selectedTab: 'horary' | 'specialDates' | 'appointmentDuration' = 'horary';

  form: FormGroup = this.fb.group({
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

  private normalizeTime(time: any) {
    return (!time || time === '--:--') ? null : time;
  }

  private removeAccents(text: string): string {
    return text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private mapDaySchedules(data: any[]) {
    return data
      .filter((d: any) => d.status)
      .map((d: any) => ({
        dayOfWeek: this.removeAccents((d.dia || '').toUpperCase()),
        morningStart: this.normalizeTime(d.mornDesde),
        morningEnd: this.normalizeTime(d.mornHasta),
        afternoonStart: this.normalizeTime(d.aftDesde),
        afternoonEnd: this.normalizeTime(d.aftHasta),
        isWorkDay: d.status,
      }));
  }

  private mapDateOverrides(list: any[]) {
    return list.map((d: any) => {
      const baseOverride: any = {
        overrideDate: d.overrideDate || '',
        isDayOff: d.ifDayOff,
        reason: d.nombre || '',
      };

      // Si es un día cerrado, no incluir datos de horas
      if (d.ifDayOff) {
        return baseOverride;
      }

      // Si no es cerrado, incluir horarios (null si están vacíos)
      return {
        ...baseOverride,
        morningStart: this.normalizeTime(d.mornDesde),
        morningEnd: this.normalizeTime(d.mornHasta),
        afternoonStart: this.normalizeTime(d.aftDesde),
        afternoonEnd: this.normalizeTime(d.aftHasta),
      };
    });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const horarios = this.horariesComp?.getData();
    const fechasEspeciales = this.specialDatesComp?.getData();
    const citas = this.servicesDurationComp?.getData() || [];

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

    this.calendarService.putCalendarConfig(payload as ICalendar).subscribe({
      next: () => {
        localStorage.setItem(
          this.appointmentsStorageKey,
          JSON.stringify(citas),
        );
        this.save.emit(payload);
      },
      error: (err) => {
        console.error('Error al guardar calendario', err);
      },
    });
  }
}
