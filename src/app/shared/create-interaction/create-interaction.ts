import {
  Component,
  inject,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormUtils } from '@app/utils/form.util';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'tyn-create-interaction',
  imports: [ReactiveFormsModule, CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './create-interaction.html',
})
export class CreateInteraction implements OnChanges {
  @Input() isOpen = false;
  formUtils = FormUtils;
  private _fb = inject(FormBuilder);
  selectedTab: string = 'select';
  currentDate = new Date();
  interactionDate = new Date();

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

    const { date, time } = this.myForm.getRawValue();
    this.interactionDate = this.buildInteractionDate(date, time);
    this.selectedTab = 'selectStartNow';
  }

  goToCreateLater(): void {
    this.selectedTab = 'selectCreateLater';
  }

  goToStartNow(): void {
    this.currentDate = new Date();
    this.interactionDate = this.currentDate;
    this.selectedTab = 'selectStartNow';
  }

  private buildInteractionDate(dateValue: string, timeValue: string): Date {
    if (!dateValue || !timeValue) return new Date();

    const parsedDate = new Date(`${dateValue}T${timeValue}`);
    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue) {
      this.selectedTab = 'select';
      this.currentDate = new Date();
      this.interactionDate = this.currentDate;
      this.myForm.reset();
    }
  }
}
