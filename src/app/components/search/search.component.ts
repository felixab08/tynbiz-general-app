import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { categoryMock } from '@app/mock/category.mock';
import { depatamentos } from '@app/mock/departamentos.mock';
import { IUbigeo, UbigeoService } from '@app/services';

@Component({
  selector: 'tyn-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  theApartament = depatamentos;

  departamentos = signal<string[]>(['']);
  provincias = signal<string[]>(['']);
  distritos = signal<IUbigeo[]>([]);
  selectedDepartamento = signal<string>('');
  selectedDistrito = signal<string>('');

  categorys = categoryMock;
  inputValue = '';
  valueSearch = output<string[]>();
  valueGeographic = output<string>();
  isModalOpen = signal(false);

  arrSearchChips: string[] = [];
  arrCategory: string[] = ['Moda'];

  private _fb = inject(FormBuilder);
  private _geographicSrv = inject(UbigeoService);

  myForm: FormGroup = this._fb.group({
    name: [''],
  });
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

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
  }

  addChips() {
    if (this.myForm.value.name === null) return;
    this.arrSearchChips.push(this.myForm.value.name);
    this.valueSearch.emit(this.arrSearchChips);
    this.myForm.reset();
  }

  removeChips(event: string) {
    const index = this.arrSearchChips.indexOf(event);
    if (index > -1) {
      this.arrSearchChips.splice(index, 1);
      this.valueSearch.emit(this.arrSearchChips);
    }
  }

  openModal() {
    this.isModalOpen.set(true);
    this.valueGeographic.emit(this.selectedDistrito());
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.valueGeographic.emit('');
  }

  selectCategory(event: any) {
    this.categorys.forEach((category: any) => {
      if (category.id === event.id) {
        return (category.state = !category.state);
      }
      return;
    });
  }
  selectCategoryData() {
    this.arrSearchChips = [];
    this.categorys.forEach((category: any) => {
      if (category.state === true) {
        this.arrSearchChips.push(category.nombre);
      }
    });
    this.isModalOpen.set(false);
    console.log('this.arrSearchChips:::::>', this.arrSearchChips);
  }
}
