import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'tyn-special-dates',
  templateUrl: './special-dates.html',
  imports: [ReactiveFormsModule, CommonModule, ],
})
export class SpecialDates {
  @Input() dateOverrides: number[] | undefined = [];
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fechasEspeciales: this.fb.array([]),
    });
    this.agregarFechaEspecial();
  }

  get fechasEspeciales(): FormArray {
    return this.form.get('fechasEspeciales') as FormArray;
  }

  crearFechaEspecial(): FormGroup {
    return this.fb.group({
      nombre: ['', []],
      overrideDate: ['', []],
      ifDayOff: [true, []],
      mornDesde: ['--:--', []],
      mornHasta: ['--:--', []],
      aftDesde: ['--:--', []],
      aftHasta: ['--:--', []],
    });
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
