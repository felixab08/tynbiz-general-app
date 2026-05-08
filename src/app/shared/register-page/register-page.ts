import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { FormUtils } from '@app/utils/form.util';
import { Router, RouterLink } from '@angular/router';
import { MenuService } from '@app/auth/services/menu.service';
import { IRegisterReq } from '@app/interfaces';

@Component({
  selector: 'tyn-register-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
})
export default class RegisterPage {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  _menuService = inject(MenuService);
  private _router = inject(Router);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    gender: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    // dni: ['', [Validators.required]],
    phone: [
      ,
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        FormUtils.validateCantNumber(9, 'Teléfono'),
      ],
    ],
    birthDate: [
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
    this._authService.postRegisterBuyerUser(this.myForm.value).subscribe({
      next: (data: any) => {
        this._authService.handleAuthSuccess(data.user, data.accessToken);
        this.myForm.reset();
        const route = this._menuService.redirectLinkForRole();
        this._router.navigate([route]);
        setTimeout(() => {
          location.reload();
        }, 500);
      },
      error: (error) => {
        console.error('Error en el registro', error);
      },
    });
  }
}
