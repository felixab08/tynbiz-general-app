import { Component, inject } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { FormUtils } from '@app/utils/form.util';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'tyn-create-interaction',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-interaction.html',
})
export class CreateInteraction {
  formUtils = FormUtils;
  private _fb = inject(FormBuilder);

  myForm: FormGroup = this._fb.group({
    typelife: ['', [Validators.required, Validators.minLength(2)]],
    date: ['', [Validators.required, FormUtils.dateMinToday()]],
    time: ['', [Validators.required, Validators.minLength(2)]],
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
  }
}
