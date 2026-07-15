import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { IErrorGeneralResp, IGeneralPDF } from '@app/interfaces';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AlertService, FileDocumentsService } from '@app/services';
import { ConditionModal } from '@app/components';

@Component({
  selector: 'tyn-register-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PdfViewerModule,
    ConditionModal,
  ],
  templateUrl: './register-page.html',
})
export default class RegisterPage {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  _menuService = inject(MenuService);
  private _router = inject(Router);
  public isOpen: boolean = false;
  private _fileDocSrv = inject(FileDocumentsService);
  filesResp = signal<IGeneralPDF[] | null>(null); // Ruta local o URL
  private _alertService = inject(AlertService);

  lookIconIsPassword = signal(false);
  lookIconIsPasswordConfirm = signal(false);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.pattern(FormUtils.emailPattern)],
      ],
      dni: ['', FormUtils.validateCantNumber(8, 'DNI')],
      documentType: ['DNI'],
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
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepit: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: this.formUtils.passIgualesValidator(
        'password',
        'passwordRepit',
      ),
    },
  );

  getFileDocumentsByClient() {
    this._fileDocSrv.getFileDocumentsByClient().subscribe({
      next: (data) => {
        this.filesResp.set(data);
      },
      error: (error) => {
        this._alertService.getAlert(
          'Error!!!',
          error.error.detail || 'Error al obtener los documentos',
          'error',
        );
      },
    });
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let formData = this.myForm.value;
    delete formData.passwordRepit;
    this._authService.postRegisterBuyerUser(formData).subscribe({
      next: (data: any) => {
        // TODO: solo mostrar mensaje con verificacion de correo y redirigir a login
        // this._authService.handleAuthSuccess(data.user, data.accessToken);
        // this.myForm.reset();
        // const route = this._menuService.redirectLinkForRole();
        // this._router.navigate([route]);
        // setTimeout(() => {
        //   location.reload();
        // }, 500);
      },
      error: (error: IErrorGeneralResp) => {
        this._alertService.getAlert(
          'Error!!!',
          error.error.detail || 'Error al registrar el usuario',
          'error',
        );
      },
    });
  }
  closeModal(event: boolean) {
    this.isOpen = event;
  }
  changeTypeInput() {
    this.lookIconIsPassword.update((value) => !value);
  }
  changeTypeInputConfirm() {
    this.lookIconIsPasswordConfirm.update((value) => !value);
  }
}
