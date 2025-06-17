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
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  storeService = inject(StoreService);
  _authService = inject(AuthService);
  hasError = signal(false);
  isModalOpen = signal(false);
  private _fb = inject(FormBuilder);

  formUtils = FormUtils;

  // "username": "emilys",
  // "password": "emilyspass",
  // "role": "admin"
  // ==================
  // "username": "noahh",
  // "password": "noahhpass",
  // "role": "moderator"

  myForm: FormGroup = this._fb.group({
    user: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

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
    this._authService
      .login(
        this.myForm.controls['user'].value,
        this.myForm.controls['password'].value
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.closeModal();
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            this.hasError.set(true);
            setTimeout(() => {
              this.hasError.set(false);
            }, 2000);
          }
        },
        error: (error) => {
          debugger;
          console.error('Login failed', error);
          this.myForm.setErrors({ loginFailed: true });
          this.hasError.set(true);
          // setTimeout(() => {
          //   this.hasError.set(false);
          // }, 2000);
        },
      });
    // this.myForm.reset();
  }

  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }
}
