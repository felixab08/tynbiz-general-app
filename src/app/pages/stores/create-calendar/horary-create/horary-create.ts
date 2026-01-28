import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IHorary } from '@app/interfaces';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-horary-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './horary-create.html',
})
export class HoraryCreate {
  horario = input.required<IHorary>();
  private _fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    status: [true, []],
    dia: ['Lunes', []],
    mornDesde: ['--:--', []],
    mornHasta: ['--:--', []],
    aftDesde: ['--:--', []],
    aftHasta: ['--:--', []],
  });

  constructor() {
    effect(() => {
      if (this.horario()) {
        this.onEdit(this.horario());
      }
    });
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    // this.myForm.reset();
  }

  onEdit(horario: IHorary) {
    this.myForm.patchValue({
      status: horario.status,
      dia: horario.dia,
      mornDesde: horario.mornDesde,
      mornHasta: horario.mornHasta,
      aftDesde: horario.aftDesde,
      aftHasta: horario.aftHasta,
    });
  }
  resetAfter() {
    this.myForm.patchValue({
      aftDesde: '--:--',
      aftHasta: '--:--',
    });
  }
  handleStatus() {
    this.horario().status = !this.horario().status;
  }
}
