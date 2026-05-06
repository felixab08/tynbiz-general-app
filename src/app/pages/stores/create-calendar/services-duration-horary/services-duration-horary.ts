import { Component, Input, input } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'tyn-services-duration-horary',
  imports: [ReactiveFormsModule],
  templateUrl: './services-duration-horary.html',
})
export class ServicesDurationHorary {
  @Input() appointmentDuration: number[] | undefined = [];
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      servicios: this.fb.array([]),
    });
    this.agregarServicio();
  }

  get servicios(): FormArray {
    return this.form.get('servicios') as FormArray;
  }

  crearServicio(): FormGroup {
    return this.fb.group({
      nombre: [''],
      tiempo: [15],
    });
  }

  agregarServicio() {
    this.servicios.push(this.crearServicio());
  }

  eliminarServicio(index: number) {
    this.servicios.removeAt(index);
  }
}
