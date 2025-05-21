import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-verific-account',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verific-account.component.html',
})
export class VerificAccountComponent {
  private _fb = inject(FormBuilder);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
  });
  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    this.myForm.reset();
  }
}
