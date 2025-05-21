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
  selector: 'tyn-profile',
  imports: [ReactiveFormsModule, CommonModule, JsonPipe],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private _fb = inject(FormBuilder);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    gender: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    dni: ['', [Validators.required]],
    phone: [
      ,
      [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
    ],
    birthdate: [
      '',
      [
        Validators.required,
        FormUtils.dataMaxToday(),
        FormUtils.edadMinimaValidator(18),
      ],
    ],
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
