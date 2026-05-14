import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarService } from '@app/services/stores/calendar.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CreateCalendarModal } from './create-calendar-modal/create-calendar-modal';

interface CalendarAppointment {
  nombre: string;
  tiempo: number;
}

@Component({
  selector: 'tyn-create-calendar',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateCalendarModal,
],
  templateUrl: './create-calendar.html',
})
export default class CreateCalendar {
  private _fb = inject(FormBuilder);
  myCalendar = inject(CalendarService);
  isModalVisible = signal(false);
  private refreshTrigger = signal<number>(0);
  private readonly appointmentsStorageKey = 'calendarAppointments';
  appointments = signal<CalendarAppointment[]>([]);

  tynForm: FormGroup = this._fb.group({
    optionNumber: ['15'],
    customNumber: [{ value: '', disabled: true }],
  });

  myCalendarResource = rxResource({
    request: () => this.refreshTrigger(),
    loader: () => this.myCalendar.getCalendarConfig() || {},
  });

  ngOnInit(): void {
    this.loadAppointmentsFromStorage();

    this.tynForm.get('optionNumber')?.valueChanges.subscribe((val) => {
      if (val === 'num') {
        this.tynForm.get('customNumber')?.enable();
        this.tynForm.get('customNumber')?.setValidators([
          (control) => {
            const value = Number(control.value);
            return value > 0 ? null : { min: true };
          },
        ]);
      } else {
        this.tynForm.get('customNumber')?.disable();
        this.tynForm.get('customNumber')?.setValue('');
        this.tynForm.get('customNumber')?.clearValidators();
      }
      this.tynForm.get('customNumber')?.updateValueAndValidity();
    });
  }

 formatTimeToAmPm(time: string | null | undefined): string {
    if (!time || time === '--:--') return '';

    const [hoursStr, minutesStr] = (time || '').split(':');
    const hours = Number(hoursStr ?? 0);
    const minutes = Number(minutesStr ?? 0);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  getSortedDaySchedules() {
    const daysOrder = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    const daySchedules = this.myCalendarResource.value()?.daySchedules || [];
    const scheduleMap = new Map(
      daySchedules.map(day => [day.dayOfWeek, day])
    );

    return daysOrder.map(day => {
      return scheduleMap.get(day) || {
        dayOfWeek: day,
        isWorkDay: false,
        morningStart: null,
        morningEnd: null,
        afternoonStart: null,
        afternoonEnd: null,
      };
    });
  }

 onModalClose() {
    this.isModalVisible.set(false);
  }

  onModalSave() {
    this.isModalVisible.set(false);
    this.loadAppointmentsFromStorage();
    this.refreshTrigger.update(val => val + 1);
  }

  private loadAppointmentsFromStorage() {
    const storedAppointments = localStorage.getItem(this.appointmentsStorageKey);

    if (!storedAppointments) {
      this.appointments.set([]);
      return;
    }

    try {
      const parsedAppointments = JSON.parse(storedAppointments) as CalendarAppointment[];
      this.appointments.set(Array.isArray(parsedAppointments) ? parsedAppointments : []);
    } catch (error) {
      console.error('Error al leer citas guardadas', error);
      this.appointments.set([]);
    }
  }
  }

