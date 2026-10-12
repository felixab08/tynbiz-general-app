import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
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
import { IErrorResp } from '@app/interfaces';
import { AlertService } from '@app/services';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  // Sin `providers: [AuthService]`: re-proveer el servicio creaba una segunda
  // instancia. El login escribía en los signals de esa instancia mientras los
  // guards y el `authInterceptor` leían la de root (con `_token() === null`), lo
  // que provocaba: `isAdmin()` siempre false, peticiones sin cabecera
  // `Authorization` y 401 que terminaban en logout + `location.reload()`.
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private _alertService = inject(AlertService);
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
            // Navegación por rol sin `location.reload()`: la redirección a
            // /admin/panel o /stores/init-store ya no se pierde por el reload.
            this._menuService.redirectLinkForRole();
            /**
             * El menú de usuario de `navbar.component.html` vive dentro de un
             * `@if`, así que el markup del dropdown **nace después** del
             * `initFlowbite()` de `AppComponent.ngOnInit`. Sin recargar, los
             * dropdowns salían sin inicializar y el clic no desplegaba nada.
             * Se re-inicializan aquí, ya con la sesión establecida.
             */
            initFlowbite();
          } else {
            this.hasError.set(true);
            setTimeout(() => {
              this.hasError.set(false);
            }, 2000);
          }
        },
        // `handleLoginError` vuelve a propagar el error (antes devolvía
        // `of(false)` y este bloque era código muerto), así que aquí se puede
        // marcar el formulario con `loginFailed`.
        error: (error: HttpErrorResponse) => {
          const detail = (error.error as IErrorResp | null | undefined)?.detail;
          if (detail) {
            this._alertService.getAlert('Error!!!', detail, 'error');
          }
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
