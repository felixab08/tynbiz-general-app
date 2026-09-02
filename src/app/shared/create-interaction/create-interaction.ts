import {
  Component,
  inject,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormUtils } from '@app/utils/form.util';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AlertService,
  InterationRoomService,
  JitsiService,
  StoreService,
} from '@app/services';
import {
  contentUserRoom,
  IErrorGeneralResp,
  IIterarionRoomResp,
  IIterationRoomReq,
  PostNotificacionWSReq,
} from '@app/interfaces';
import { signal } from '@angular/core';
import { NotImagePipe } from '@app/pipes';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tyn-create-interaction',
  imports: [ReactiveFormsModule, CommonModule, DatePipe, NotImagePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './create-interaction.html',
})
export class CreateInteraction implements OnChanges {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<boolean>();
  formUtils = FormUtils;
  private _fb = inject(FormBuilder);
  private _interationSrv = inject(InterationRoomService);
  private _alert = inject(AlertService);
  private _jitsiSrv = inject(JitsiService);

  refreshToken: string | null = null;

  selectedTab: string = 'select';
  listUsers = signal<contentUserRoom[] | null>(null);
  lookingForUser = signal(false);
  listSelecteUser = signal<contentUserRoom[] | null>(null);
  respInteractionRoom: IIterarionRoomResp | null = null;
  searchSubject = new Subject<string>();

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
    let dataValue: IIterationRoomReq = {
      scheduledAt: date + 'T' + time,
      visibility: this.myForm.controls['visibility'].value as
        | 'PUBLICO'
        | 'PRIVADO',
    };
    this.createInteraction(dataValue);
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
    this.createInteraction(dataValue);
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((email: string) => {
        this.searchUserByEmail(email);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue) {
      this.selectedTab = 'select';
      this.myForm.reset();
    }
  }

  createInteraction(dataValue: IIterationRoomReq): void {
    this._interationSrv.postIterarionRoom(dataValue).subscribe({
      next: (resp: IIterarionRoomResp) => {
        this.respInteractionRoom = resp;
        this._alert.addAlert({
          title: 'Interacción creada correctamente',
          message: 'La interacción ha sido creada correctamente',
          type: 'success',
        });
        this.selectedTab = 'selectStartNow';
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

  searchUserByEmail(email: string): void {
    const normalizedEmail = (email || '').trim();
    if (!normalizedEmail) {
      this.lookingForUser.set(false);
      this.listUsers.set(null);
      return;
    }

    this._interationSrv.getCategoryByStore(normalizedEmail).subscribe({
      next: (resp: any) => {
        console.log(resp);
        const users =
          resp?.contentUser ||
          resp?.content ||
          (Array.isArray(resp) ? resp : []);
        this.listUsers.set(users);
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

  // Alias for backward compatibility
  searhchUserByEmail(email: string): void {
    this.searchUserByEmail(email);
  }

  selectionUser(user: contentUserRoom): void {
    this.lookingForUser.set(false);
    if (this.listSelecteUser()) {
      if (this.listSelecteUser()?.some((u) => u.id === user.id)) {
        this._alert.addAlert({
          title: 'Usuario ya seleccionado',
          message: 'El usuario ya ha sido seleccionado',
          type: 'warning',
        });
        return;
      }
      this.listSelecteUser.set([...this.listSelecteUser()!, user]);
    } else {
      this.listSelecteUser.set([user]);
    }
    this.myFormEmail.reset();
  }

  removeUser(userId: number): void {
    this.listSelecteUser.update((list) => list!.filter((u) => u.id !== userId));
  }
  sendDataFriends(): void {
    console.log('sendDataFriends');
    if (this.listSelecteUser()?.length == 0) {
      this._alert.addAlert({
        title: 'Error al crear la interacción',
        message: 'No se seleccionaron usuarios',
        type: 'error',
      });
      return;
    }
    let IdsUser: number[] = this.listSelecteUser()!.map((u) => u.id);
    let notification: PostNotificacionWSReq = {
      userIds: IdsUser,
      title: 'Invitación a sala',
      message: 'Has sido invitado a una sala en vivo.',
      content: {
        videoRoomName: this.respInteractionRoom?.videoRoomName,
        videoRoomUrl: this.respInteractionRoom?.videoRoomUrl,
      },
    };

    this._interationSrv.postNotificacionWS(notification).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this._alert.addAlert({
          title: 'Invitación enviada correctamente',
          message: 'La invitación ha sido enviada correctamente',
          type: 'success',
        });
        this.listSelecteUser.set(null);
      },
      error: (error: IErrorGeneralResp) => {
        this._alert.addAlert({
          title: 'Error al enviar la invitación',
          message: error.error.detail,
          type: 'error',
        });
      },
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    this._alert.addAlert({
      title: 'Link copiado correctamente',
      message: 'El link ha sido copiado correctamente',
      type: 'success',
    });
  }
  closeModalIntera() {
    this.isOpen = false;
    this.closeModal.emit(false);
  }

  createJitsi(videoRoomUrl: string) {
    this._jitsiSrv.createJitsi(videoRoomUrl);
  }
}
