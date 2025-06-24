import { Component, inject } from '@angular/core';
import { UserDetailPrivilegePageComponent } from '../../user-detail-page/user-detail-privilege-page/user-detail-privilege-page.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@app/utils/form.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tyn-form-new-role-page',
  imports: [
    UserDetailPrivilegePageComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './form-new-role-page.component.html',
})
export class FormNewRolePageComponent {
  private _fb = inject(FormBuilder);

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    role: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    this.myForm.reset();
  }
}
