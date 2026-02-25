import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IHorary } from '@app/interfaces';
import { FormUtils } from '@app/utils/form.util';
import { dataHours } from './horaries.database';

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
    lunes: this._fb.group({
      status: [false, []],
      dia: ['Lunes', []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    }),
    martes: this._fb.group({
      status: [false, []],
      dia: ['Martes', []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    }),
    miercoles: this._fb.group({
      status: [false, []],
      dia: ['Miércoles', []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    }),
    jueves: this._fb.group({
      status: [false, []],
      dia: ['Jueves', []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    }),
    viernes: this._fb.group({
      status: [false, []],
      dia: ['Viernes', []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    }),
    sabado: this._fb.group({
      status: [false, []],
      dia: ['Sábado', []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    }),
    domingo: this._fb.group({
      status: [false, []],
      dia: ['Domingo', []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    }),
  });

  constructor() {
    this.onEdit(this.horario);
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    // console.log('Form submitted', this.myForm.value);
    this.listWhitStatusActive(this.myForm.value);
  }

  listWhitStatusActive(formValue: any) {
    const activeDays = [];
    for (const day in formValue) {
      if (formValue[day].status) {
        activeDays.push(formValue[day]);
      }
    }
    console.log('Active days:', activeDays);
  }

  onEdit(horario: IHorary[] | undefined) {
    if (!Array.isArray(horario)) return;

    // Rellena cada FormGroup (lunes..domingo) con los valores del array `horario`
    for (let i = 0; i < this.dayKeys.length; i++) {
      const key = this.keyForIndex(i);
      const group = this.getDayGroup(key);
      const src = horario[i];
      if (!group) continue;

      // Si no hay objeto fuente, dejamos los valores por defecto del formulario
      if (!src) {
        group.patchValue({ status: false });
        continue;
      }

      group.patchValue({
        status: !!src.status,
        dia: src.dia ?? group.get('dia')?.value,
        mornDesde: src.mornDesde ?? '--:--',
        mornHasta: src.mornHasta ?? '--:--',
        aftDesde: src.aftDesde ?? '--:--',
        aftHasta: src.aftHasta ?? '--:--',
      });
    }
  }

  resetMorng() {
    this.myForm.patchValue({
      mornDesde: '--:--',
      mornHasta: '--:--',
    });
    const g = this.getDayGroup('lunes');
    g.patchValue({
      mornDesde: '--:--',
      mornHasta: '--:--',
    });
  }
  resetAfter() {
    this.myForm.patchValue({
      aftDesde: '--:--',
      aftHasta: '--:--',
    });
    const g = this.getDayGroup('lunes');
    g.patchValue({
      aftDesde: '--:--',
      aftHasta: '--:--',
    });
  }

  handleStatus(index: number) {
    const key = this.keyForIndex(index);
    console.log(key);

    const group = this.getDayGroup(key);
    if (!group) return;

    // El control 'status' ya habrá sido actualizado por el checkbox,
    // leemos el valor actual del grupo y sincronizamos el array `horario`.
    const current = group.value;
    const payload = current.status
      ? {
          status: !!current.status,
          dia: current.dia,
          mornDesde: current.mornDesde,
          mornHasta: current.mornHasta,
          aftDesde: current.aftDesde,
          aftHasta: current.aftHasta,
        }
      : { status: !!current.status, dia: current.dia };

    if (!this.horario) this.horario = [];
    // Conserva propiedades que pueda necesitar IHorary y sobrescribe con payload
    this.horario[index] = {
      ...(this.horario[index] || {}),
      ...payload,
    } as IHorary;
  }

  // Devuelve el FormGroup de un día por su clave (lunes, martes, ...)
  getDayGroup(day: string): FormGroup {
    return this.myForm.get(day) as FormGroup;
  }

  // Mapeo índice -> clave del grupo
  private dayKeys = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ];

  private keyForIndex(index: number) {
    return this.dayKeys[index] || 'lunes';
  }
}
