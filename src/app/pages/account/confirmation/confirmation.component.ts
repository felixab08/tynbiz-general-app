import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { StoreService } from '@app/services/store.service';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-confirmation',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './confirmation.component.html',
})
export default class ConfirmationComponent {
  storeService = inject(StoreService);
  _authService = inject(AuthService);
  hasError = signal(false);
  isModalOpen = signal(false);
  private _fb = inject(FormBuilder);
  lookIconIsPassword = signal(true);
  lookIconIsPasswordConfirm = signal(true);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group(
    {
      user: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(FormUtils.emailPattern),
        ],
      ],
      newpassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.formUtils.passwordSeguraValidator(),
        ],
      ],
      confirmationPassword: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
    },
    {
      validators: this.formUtils.passIgualesValidator(
        'newpassword',
        'confirmationPassword'
      ),
    }
  );

  ngOnInit(): void {
    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isModalOpen.set(!isLoggedIn);
    });
  }

  logginForm() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log(this.myForm.value);

    // this._authService
    //   .login(
    //     this.myForm.controls['user'].value,
    //     this.myForm.controls['password'].value
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       if (response) {
    //         this.closeModal();
    //         setTimeout(() => {
    //           location.reload();
    //         }, 1000);
    //       } else {
    //         this.hasError.set(true);
    //         setTimeout(() => {
    //           this.hasError.set(false);
    //         }, 2000);
    //       }
    //     },
    //     error: (error) => {
    //       debugger;
    //       console.error('Login failed', error);
    //       this.myForm.setErrors({ loginFailed: true });
    //       this.hasError.set(true);
    //       setTimeout(() => {
    //         this.hasError.set(false);
    //       }, 2000);
    //     },
    //   });
    // this.myForm.reset();
  }
  changeTypeInput() {
    const inputPassword = document.getElementById(
      'newpassword'
    ) as HTMLInputElement;
    if (inputPassword.type === 'password') {
      inputPassword.type = 'text';
      this.lookIconIsPassword.set(false);
    } else {
      inputPassword.type = 'password';
      this.lookIconIsPassword.set(true);
    }
  }
  changeTypeInputConfirm() {
    const inputPassword = document.getElementById(
      'confirmationPassword'
    ) as HTMLInputElement;
    if (inputPassword.type === 'password') {
      inputPassword.type = 'text';
      this.lookIconIsPasswordConfirm.set(false);
    } else {
      inputPassword.type = 'password';
      this.lookIconIsPasswordConfirm.set(true);
    }
  }
}
