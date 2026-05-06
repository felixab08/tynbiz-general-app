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
import { Router, RouterLink } from '@angular/router';
import { MenuService } from '@app/auth/services/menu.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  providers: [AuthService],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  storeService = inject(StoreService);
  _authService = inject(AuthService);
  _menuService = inject(MenuService);
  _router = inject(Router);
  hasError = signal(false);
  isModalOpen = signal(false);
  private _fb = inject(FormBuilder);
  lookIconIsPassword = signal(false);

  formUtils = FormUtils;
  myForm: FormGroup = this._fb.group({
    user: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
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
        this.myForm.controls['password'].value,
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.closeModal();
            const route = this._menuService.redirectLinkForRole();
            this._router.navigate([route]);
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
          setTimeout(() => {
            this.hasError.set(false);
          }, 2000);
        },
      });
    // this.myForm.reset();
  }
  changeTypeInput() {
    this.lookIconIsPassword.update((value) => !value);
  }

  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }
}
