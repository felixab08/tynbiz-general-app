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
import { AlertService, InterationRoomService } from '@app/services';
import { contentUserRoom, IIterationRoomReq } from '@app/interfaces';
import { NotImagePipe } from '../../pipes/not-image.pipe';
import { signal } from '@angular/core';

@Component({
  selector: 'tyn-create-interaction',
  imports: [ReactiveFormsModule, CommonModule, DatePipe, NotImagePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './create-interaction.html',
})
export class CreateInteraction implements OnChanges {
  @Input() isOpen = false;
  formUtils = FormUtils;
  private _fb = inject(FormBuilder);
  private _interationSrv = inject(InterationRoomService);
  private _alert = inject(AlertService);
  selectedTab: string = 'select';
  currentDate = new Date();
  interactionDate = new Date();
  listUsers = signal<contentUserRoom[] | null>(null);
  lookingForUser = signal(false);

  myForm: FormGroup = this._fb.group({
    visibility: ['', [Validators.required, Validators.minLength(2)]],
    date: ['', [Validators.required, FormUtils.dateMinToday()]],
    time: ['', [Validators.required, Validators.minLength(2)]],
  });

  myFormEmail: FormGroup = this._fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
    ],
  });
  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const { date, time } = this.myForm.getRawValue();
    this.interactionDate = this.buildInteractionDate(date, time);
    let dataValue: IIterationRoomReq = {
      scheduledAt: date + 'T' + time,
      visibility: this.myForm.controls['visibility'].value as
        | 'PUBLICO'
        | 'PRIVADO',
    };
    this.createInteraction(dataValue);

    this.selectedTab = 'selectStartNow';
  }

  goToCreateLater(): void {
    this.selectedTab = 'selectCreateLater';
  }

  goToStartNow(): void {
    let dataValue: IIterationRoomReq = {
      scheduledAt: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 19),
      visibility: 'PUBLICO',
    };
    console.log(dataValue);
    // this.createInteraction(dataValue);
    this.interactionDate = new Date();
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

  createInteraction(dataValue: IIterationRoomReq): void {
    this._interationSrv.postIterarionRoom(dataValue).subscribe({
      next: (resp: any) => {
        this._alert.addAlert({
          title: 'Interacción creada correctamente',
          message: 'La interacción ha sido creada correctamente',
          type: 'success',
        });
      },
      error: (error: any) => {
        this._alert.addAlert({
          title: 'Error al crear la interacción',
          message: error.message,
          type: 'error',
        });
      },
    });
  }

  searhchUserByEmail(email: string): void {
    this._interationSrv.getCategoryByStore(email).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.listUsers.set(resp.contentUser);
        this.lookingForUser.set(true);
      },
      error: (error: any) => {
        this.lookingForUser.set(false);
        this._alert.addAlert({
          title: 'Error al buscar el usuario',
          message: error.message,
          type: 'error',
        });
      },
    });
  }
}
