import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tyn-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  inputValue = '';
  valueSearch = output<string[]>();

  private _fb = inject(FormBuilder);

  myForm: FormGroup = this._fb.group({
    name: [''],
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
  }
  arrSearchChips: string[] = [];
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
}
