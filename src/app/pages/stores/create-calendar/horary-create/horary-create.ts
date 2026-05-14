import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DaySchedule } from '@app/interfaces';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-horary-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './horary-create.html',
})
export class HoraryCreate {
  daySchedules = input<DaySchedule[] | undefined>();
  selectHour = output<DaySchedule[]>();
  private _fb = inject(FormBuilder);
  formUtils = FormUtils;
  daySchedulesState: DaySchedule[] = [];

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

  private syncInputsEffect = effect(() => {
    this.resetDayGroups();
    this.onLoadDaySchedules(this.daySchedules() ?? []);
  });

  isDayActive(index: number): boolean {
    const group = this.getDayGroup(this.keyForIndex(index));
    return !!group?.get('status')?.value;
  }

  getDayLabel(index: number): string {
    const key = this.keyForIndex(index);
    const group = this.getDayGroup(key);

    return group?.get('dia')?.value || '';
  }

  onEdit(horario: DaySchedule[] | undefined) {
    if (!Array.isArray(horario)) return;

    this.daySchedulesState = [...horario];

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
        status: !!src.isWorkDay,
        dia: src.dayOfWeek ?? group.get('dia')?.value,
        mornDesde: src.morningStart ?? '--:--',
        mornHasta: src.morningEnd ?? '--:--',
        aftDesde: src.afternoonStart ?? '--:--',
        aftHasta: src.afternoonEnd ?? '--:--',
      });
    }
  }

  onLoadDaySchedules(daySchedules: DaySchedule[]) {
    if (!Array.isArray(daySchedules) || daySchedules.length === 0) return;

    for (const schedule of daySchedules) {
      const key = this.keyForDayOfWeek(schedule.dayOfWeek);
      const group = this.getDayGroup(key);

      if (!group) continue;

      group.patchValue({
        status: !!schedule.isWorkDay,
        dia: group.get('dia')?.value,
        mornDesde: this.normalizeTimeForInput(schedule.morningStart),
        mornHasta: this.normalizeTimeForInput(schedule.morningEnd),
        aftDesde: this.normalizeTimeForInput(schedule.afternoonStart),
        aftHasta: this.normalizeTimeForInput(schedule.afternoonEnd),
      });

      const index = this.keyToIndex(key);
      if (index >= 0) {
        this.daySchedulesState[index] = {
          ...(this.daySchedulesState[index] || {}),
          dayOfWeek: schedule.dayOfWeek,

        } as DaySchedule;
      }
    }
  }

  private resetDayGroups() {
    for (const key of this.dayKeys) {
      const group = this.getDayGroup(key);
      if (!group) continue;

      group.patchValue({
        status: false,
        mornDesde: '--:--',
        mornHasta: '--:--',
        aftDesde: '--:--',
        aftHasta: '--:--',
      });
    }
  }

  private normalizeTimeForInput(time: any): string {
    if (!time) return '--:--';
    if (typeof time === 'string') return time.slice(0, 5);
    return '--:--';
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

      this.daySchedulesState[index] = {
        ...(this.daySchedulesState[index] || {}),
        ...payload,
      } as DaySchedule;

      this.selectHour.emit(current as DaySchedule[]);
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

  private keyForDayOfWeek(dayOfWeek: string): string {
    const normalized = (dayOfWeek || '').trim().toUpperCase();

    switch (normalized) {
      case 'LUNES':
        return 'lunes';
      case 'MARTES':
        return 'martes';
      case 'MIERCOLES':
      case 'MIÉRCOLES':
        return 'miercoles';
      case 'JUEVES':
        return 'jueves';
      case 'VIERNES':
        return 'viernes';
      case 'SABADO':
      case 'SÁBADO':
        return 'sabado';
      case 'DOMINGO':
        return 'domingo';
      default:
        return 'lunes';
    }
  }

  private keyToIndex(key: string): number {
    return this.dayKeys.indexOf(key);
  }

}
