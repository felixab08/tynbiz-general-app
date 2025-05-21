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
  selector: 'tyn-change-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private _fb = inject(FormBuilder);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group(
    {
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.formUtils.passwordSeguraValidator(),
        ],
      ],
      newPasswordRepit: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: this.formUtils.passIgualesValidator(
        'newPassword',
        'newPasswordRepit'
      ),
    }
  );

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    this.myForm.reset();
  }
}
