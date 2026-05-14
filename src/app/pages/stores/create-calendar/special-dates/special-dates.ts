import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, input, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateOverride } from '@app/interfaces';
@Component({
  selector: 'tyn-special-dates',
  templateUrl: './special-dates.html',
  imports: [ReactiveFormsModule, CommonModule, ],
})
export class SpecialDates {
  dateOverrides = input<DateOverride[] | undefined>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      fechasEspeciales: this.fb.array([]),
    });

    effect(() => {
      const overrides = this.dateOverrides();
      if (overrides && overrides.length > 0) {
        this.inicializarDesdeOverrides(overrides);
      } else {
        this.limpiarFormArray();
      }
    });
  }

  get fechasEspeciales(): FormArray {
    return this.form.get('fechasEspeciales') as FormArray;
  }

  crearFechaEspecial(override?: DateOverride): FormGroup {
    return this.fb.group({
      nombre: [override?.reason || '', []],
      overrideDate: [override?.overrideDate || '', []],
      ifDayOff: [override?.isDayOff !== undefined ? override.isDayOff : true, []],
      mornDesde: [override?.morningStart || '--:--', []],
      mornHasta: [override?.morningEnd || '--:--', []],
      aftDesde: [override?.afternoonStart || '--:--', []],
      aftHasta: [override?.afternoonEnd || '--:--', []],
    });
  }

  inicializarDesdeOverrides(overrides: DateOverride[]) {
    this.limpiarFormArray();
    overrides.forEach(override => {
      this.fechasEspeciales.push(this.crearFechaEspecial(override));
    });
    this.cdr.markForCheck();
  }

  limpiarFormArray() {
    while (this.fechasEspeciales.length > 0) {
      this.fechasEspeciales.removeAt(0);
    }
  }

  agregarFechaEspecial() {
    this.fechasEspeciales.push(this.crearFechaEspecial());
  }

  eliminarFechaEspecial(index: number) {
    this.fechasEspeciales.removeAt(index);
  }

  getData() {
    return this.form.value;
  }
}
