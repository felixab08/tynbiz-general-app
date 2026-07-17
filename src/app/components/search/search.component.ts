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
import { ReactiveFormsModule } from '@angular/forms';
import { IErrorGeneralResp, SelectedOption } from '@app/interfaces';
import {
  AlertService,
  CategoryService,
  IUbigeo,
  UbigeoService,
} from '@app/services';

@Component({
  selector: 'tyn-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  listCategories = signal<SelectedOption[] | null>(null);
  departamentos = signal<string[]>(['']);
  provincias = signal<string[]>(['']);
  distritos = signal<IUbigeo[]>([]);
  selectedDepartamento = signal<string>('');
  selectedDistrito = signal<string>('');

  valueSearch = output<string>();
  valueGeographic = output<string>();
  valueCategory = output<string>();
  isModalOpen = signal(false);

  initialValue = input<string>('');
  titleValue = input<string>('Filtra tus creaciones');
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  private _categoryService = inject(CategoryService);
  private _alertService = inject(AlertService);
  private _geographicSrv = inject(UbigeoService);

  constructor() {
    this.getCategories();
    this.getDepartamento();
  }

  getCategories() {
    this._categoryService.getCategoryByStore().subscribe({
      next: (resp) => {
        this.listCategories.set(resp);
      },
      error: (err: IErrorGeneralResp) => {
        this._alertService.getAlert(
          'Error!!!',
          err.error.detail || 'Error, comuniquese con los respomsables.',
          'error',
        );
      },
    });
  }

  getDepartamento() {
    this._geographicSrv.getDepartamento().subscribe({
      next: (resp) => {
        this.departamentos.set(resp);
      },
      error: (err: IErrorGeneralResp) => {
        this._alertService.getAlert(
          'Error!!!',
          err.error.detail || 'Error, comuniquese con los respomsables.',
          'error',
        );
      },
    });
  }

  handlerDepartamento(event: any) {
    this.selectedDepartamento.set(event.value);
    this._geographicSrv.getProvincias(event.value).subscribe({
      next: (resp) => {
        this.provincias.set(resp);
      },
      error: (err: IErrorGeneralResp) => {
        this._alertService.getAlert(
          'Error!!!',
          err.error.detail || 'Error, comuniquese con los respomsables.',
          'error',
        );
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
        error: (err: IErrorGeneralResp) => {
          this._alertService.getAlert(
            'Error!!!',
            err.error.detail || 'Error, comuniquese con los respomsables.',
            'error',
          );
        },
      });
  }
  handlerCategory(event: any) {
    this.valueCategory.emit(event.value);
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
