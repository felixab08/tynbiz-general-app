import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@app/utils/form.util';
import { count } from 'rxjs';

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
      UserName: ['', [Validators.required]],
      fullNamePerson: [
        '',
        [Validators.required, Validators.pattern(this.formUtils.dobleLastName)],
      ],
      dniPerson: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
      ],
      birthdate: [
        '',
        [Validators.required, this.formUtils.edadMinimaValidator(18)],
      ],
      gender: ['', [Validators.required]],
      ubigeo: ['1', [Validators.required]],
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
        'password',
        'passwordRepit'
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
