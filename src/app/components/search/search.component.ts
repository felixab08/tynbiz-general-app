import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { categoryMock } from '@app/mock/category.mock';
import { depatamentos } from '@app/mock/departamentos.mock';

@Component({
  selector: 'tyn-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  theApartament = depatamentos;
  categorys = categoryMock;
  inputValue = '';
  valueSearch = output<string[]>();
  isModalOpen = signal(false);

  arrSearchChips: string[] = [];
  arrCategory: string[] = ['Moda'];

  private _fb = inject(FormBuilder);

  myForm: FormGroup = this._fb.group({
    name: [''],
  });

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
  }

  closeModal() {
    this.isModalOpen.set(false);
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
