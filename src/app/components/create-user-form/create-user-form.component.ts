import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-create-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user-form.component.html',
})
export class CreateUserFormComponent {
  private _fb = inject(FormBuilder);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group(
    {
      fullNamePerson: [
        '',
        [Validators.required, Validators.pattern(FormUtils.dobleLastName)],
      ],
      dniPerson: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(FormUtils.emailPattern)],
      ],
      ubigeo: ['', [Validators.required]],
      direction: ['', [Validators.required]],
      phone: [
        ,
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      status: ['', [Validators.required]],
      role: ['', [Validators.required]],
      accounUser: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.formUtils.passwordSeguraValidator(),
        ],
      ],
      passwordRepit: ['', [Validators.required, Validators.minLength(8)]],
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
