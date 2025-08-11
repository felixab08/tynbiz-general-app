import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@app/utils/form.util';
import { RolesService } from '@app/services/admin/roles.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UsersService } from '@app/services/admin/users.service';
import { AlertService } from '@app/services/alert.service';
import { UserMapper } from '@app/mappers/admin/users.mapper';

@Component({
  selector: 'tyn-create-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user-form.component.html',
})
export class CreateUserFormComponent {
  formChange = output<boolean>();
  private _fb = inject(FormBuilder);
  public _rolesService = inject(RolesService);
  public _alertService = inject(AlertService);
  private _usersService = inject(UsersService);
  formUtils = FormUtils;
  alertCreate = signal(false);
  myForm: FormGroup = this._fb.group({});

  ngOnInit(): void {
    this.createForm();
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this._usersService
      .postRegisterUser(UserMapper.mapResrtUserToUser(this.myForm.value))
      .subscribe({
        next: (resp) => {
          this.myForm.reset();
          this.createForm();
          this._alertService.getAlert(
            'Usuario Creado',
            'Usuario creado satisfactoriamente',
            'success'
          );
          this.formChange.emit(true);
        },
        error: (error: any) => {
          this._alertService.getAlert(
            'Error!!!',
            'Error al registrar el usuario',
            'error'
          );
        },
      });
  }
  createForm() {
    this.myForm = this._fb.group(
      {
        UserName: ['', [Validators.required]],
        fullNamePerson: [
          '',
          [
            Validators.required,
            Validators.pattern(this.formUtils.dobleLastName),
          ],
        ],
        dniPerson: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(this.formUtils.emailPattern),
          ],
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
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
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
  }
  rolesResorce = rxResource({
    request: () => ({
      page: 0,
      size: 100,
    }),
    loader: ({ request }) => {
      return (
        this._rolesService.getRoles({
          page: request.page,
          size: request.size,
        }) || {}
      );
    },
  });
}
