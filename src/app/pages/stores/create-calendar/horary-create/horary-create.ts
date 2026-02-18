import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IHorary } from '@app/interfaces';
import { FormUtils } from '@app/utils/form.util';
import { dataHours } from '../horaries/horaries.database';

@Component({
  selector: 'tyn-horary-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './horary-create.html',
})
export class HoraryCreate {
  horario: IHorary[] = dataHours;

  selectHour = output<IHorary>();
  private _fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    // lunes
    lunStatus: [false, []],
    lunDia: ['Lunes', []],
    lunMornDesde: ['08:00', []],
    lunMornHasta: ['13:00', []],
    lunAftDesde: ['15:00', []],
    lunAftHasta: ['19:00', []],
    // martes
    marStatus: [false, []],
    marDia: ['Martes', []],
    marMornDesde: ['08:00', []],
    marMornHasta: ['13:00', []],
    marAftDesde: ['15:00', []],
    marAftHasta: ['19:00', []],
    // miercoles
    mieStatus: [false, []],
    mieDia: ['Miércoles', []],
    mieMornDesde: ['08:00', []],
    mieMornHasta: ['13:00', []],
    mieAftDesde: ['15:00', []],
    mieAftHasta: ['19:00', []],
    // jueves
    jueStatus: [false, []],
    jueDia: ['Jueves', []],
    jueMornDesde: ['08:00', []],
    jueMornHasta: ['13:00', []],
    jueAftDesde: ['15:00', []],
    jueAftHasta: ['19:00', []],
    // viernes
    vieStatus: [false, []],
    vieDia: ['Viernes', []],
    vieMornDesde: ['08:00', []],
    vieMornHasta: ['13:00', []],
    vieAftDesde: ['15:00', []],
    vieAftHasta: ['19:00', []],
    // sábado
    sabStatus: [false, []],
    sabDia: ['Sábado', []],
    sabMornDesde: ['08:00', []],
    sabMornHasta: ['13:00', []],
    sabAftDesde: ['15:00', []],
    sabAftHasta: ['19:00', []],
    // domingo
    domStatus: [false, []],
    domDia: ['Domingo', []],
    domMornDesde: ['08:00', []],
    domMornHasta: ['13:00', []],
    domAftDesde: ['15:00', []],
    domAftHasta: ['19:00', []],
  });

  constructor() {}

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    // this.selectHour.emit(this.myForm.value);
    // this.myForm.reset();
  }

  // onEdit(horario: IHorary) {
  //   this.myForm.patchValue({
  //     status: horario.status,
  //     dia: horario.dia,
  //     mornDesde: horario.mornDesde,
  //     mornHasta: horario.mornHasta,
  //     aftDesde: horario.aftDesde,
  //     aftHasta: horario.aftHasta,
  //   });
  // }

  resetMorng() {
    this.myForm.patchValue({
      mornDesde: '--:--',
      mornHasta: '--:--',
    });
  }
  resetAfter() {
    this.myForm.patchValue({
      aftDesde: '--:--',
      aftHasta: '--:--',
    });
  }

  handleStatus() {
    this.horario[0].status = !this.horario[0].status;
  }

  // debounceEffect = effect((onCleanup) => {
  //   const value = this.myForm.value;
  //   const timeout = setTimeout(() => {
  //     console.log(value);
  //     this.selectHour.emit(value);
  //   }, 1500);
  //   onCleanup(() => {
  //     clearTimeout(timeout);
  //   });
  // });
}
