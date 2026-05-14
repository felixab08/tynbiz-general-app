import { Component, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormGroup,
} from '@angular/forms';

interface AppointmentItem {
  nombre: string;
  tiempo: number;
}

@Component({
  selector: 'tyn-services-duration-horary',
  imports: [ReactiveFormsModule],
  templateUrl: './services-duration-horary.html',
})
export class ServicesDurationHorary implements OnInit {
  @Input() appointmentDuration: number[] | undefined = [];
  form!: FormGroup;
  private readonly appointmentsStorageKey = 'calendarAppointments';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      servicios: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadSavedAppointments();
  }

  get servicios(): FormArray {
    return this.form.get('servicios') as FormArray;
  }

  crearServicio(servicio?: Partial<AppointmentItem>): FormGroup {
    return this.fb.group({
      nombre: [servicio?.nombre || ''],
      tiempo: [servicio?.tiempo || 15],
    });
  }

  agregarServicio(servicio?: Partial<AppointmentItem>) {
    this.servicios.push(this.crearServicio(servicio));
  }

  eliminarServicio(index: number) {
    this.servicios.removeAt(index);

    if (this.servicios.length === 0) {
      this.agregarServicio();
    }
  }

  getData() {
    return this.servicios.controls
      .map((control) => ({
        nombre: String(control.value?.nombre || '').trim(),
        tiempo: Number(control.value?.tiempo || 15),
      }))
      .filter((servicio) => servicio?.nombre?.trim());
  }

  private loadSavedAppointments() {
    const storedAppointments = localStorage.getItem(this.appointmentsStorageKey);

    if (!storedAppointments) {
      this.agregarServicio();
      return;
    }

    try {
      const parsedAppointments = JSON.parse(storedAppointments) as AppointmentItem[];

      if (!Array.isArray(parsedAppointments) || parsedAppointments.length === 0) {
        this.agregarServicio();
        return;
      }

      parsedAppointments.forEach((appointment) => {
        this.servicios.push(
          this.crearServicio({
            nombre: appointment.nombre,
            tiempo: Number(appointment.tiempo) || 15,
          }),
        );
      });
    } catch (error) {
      console.error('Error al leer citas guardadas', error);
      this.agregarServicio();
    }
  }
}
