import {
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AngularMyDatePickerModule,
} from '@nodro7/angular-mydatepicker';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarService } from '@app/services/stores/calendar.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CreateCalendarModal } from './create-calendar-modal/create-calendar-modal';
import { TimeOfDayPipe } from '@app/pipes/time-of-day.pipe';
@Component({
  selector: 'tyn-create-calendar',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateCalendarModal,
    TimeOfDayPipe
],
  templateUrl: './create-calendar.html',
})
export default class CreateCalendar {
  private _fb = inject(FormBuilder);
  myCalendar = inject(CalendarService);
  isModalVisible = signal(false);

  tynForm: FormGroup = this._fb.group({
    optionNumber: ['15'],
    customNumber: [{ value: '', disabled: true }],
  });

  myCalendarResource = rxResource({
    request: () => ({}),
    loader: () => this.myCalendar.getCalendarConfig() || {},
  });

  ngOnInit(): void {
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

 onModalClose() {
    this.isModalVisible.set(false);
  }
  onModalSave() {
    this.isModalVisible.set(false);
  }
}
