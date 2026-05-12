import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUbigeo, UbigeoService } from '@app/services';

@Component({
  selector: 'tyn-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  departamentos = signal<string[]>(['']);
  provincias = signal<string[]>(['']);
  distritos = signal<IUbigeo[]>([]);
  selectedDepartamento = signal<string>('');
  selectedDistrito = signal<string>('');

  valueSearch = output<string>();
  valueGeographic = output<string>();
  isModalOpen = signal(false);

  initialValue = input<string>('');
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  private _fb = inject(FormBuilder);
  private _geographicSrv = inject(UbigeoService);

  constructor() {
    this.getDepartamento();
  }
  getDepartamento() {
    this._geographicSrv.getDepartamento().subscribe({
      next: (resp) => {
        this.departamentos.set(resp);
      },
    });
  }

  handlerDepartamento(event: any) {
    this.selectedDepartamento.set(event.value);
    this._geographicSrv.getProvincias(event.value).subscribe({
      next: (resp) => {
        this.provincias.set(resp);
      },
    });
  }
  handlerDistrito(event: any) {
    this.selectedDistrito.set(event.value);
  }
  handlerProvincia(event: any) {
    this._geographicSrv
      .getDistrito(this.selectedDepartamento(), event.value)
      .subscribe({
        next: (resp) => {
          this.distritos.set(resp);
        },
      });
  }

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.valueSearch.emit(value);
    }, 500);
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.valueGeographic.emit(this.selectedDistrito());
  }
  cleanFilter() {
    this.valueSearch.emit('');
    this.selectedDepartamento.set('');
    this.selectedDistrito.set('');
    this.provincias.set(['']);
    this.distritos.set([]);
  }
}
