import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  inject,
  effect,
} from '@angular/core';
import { ContentContact } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes';
import {
  ContactService,
  JitsiService,
  StoreService,
  TimeRemainingService,
} from '@app/services';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
  selector: 'tyn-card-contact-store-page',
  imports: [CommonModule, NotImagePipe, ModalComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './card-contact-store-page.component.html',
})
export class CardContactStorePageComponent {
  listContact = input.required<ContentContact>();
  _contactService = inject(ContactService);
  private _jitsiService = inject(JitsiService);
  private _timeRemainingSrv = inject(TimeRemainingService);
  interval: any;
  isOpen = false;
  hoursForMeeting = {
    status: 'WAITING',
    message: 'Calculando...',
    timeRemaining: 'Espere.',
  };

  createJitsi(videoRoomUrl: string) {
    console.log(videoRoomUrl);
    this._jitsiService.createJitsi(videoRoomUrl);
    this._contactService
      .patchangeStatusContact(this.listContact().id, 'COMPLETADA')
      .subscribe({
        next: (res) => {
          console.log('Status changed successfully:', res);
        },
        error: (err) => {
          console.error('Error changing status:', err);
        },
      });
  }
  closeModal() {
    this.isOpen = false;
    clearInterval(this.interval);
  }

  /**
   * se debe mostrar un modal cuando la fecha de la cita sea igual a la fecha actual y mostrar el tiempo restante para la reunión.
   * si la hora de la cita coincide con la hora actual, se debe mostrar un mensaje indicando que la reunión ya comenzó.
   * si la hora de la cita es menor a la hora actual por una hora, se debe mostrar un mensaje indicando que la reunión finalizó.
   * @param content
   */

  lookTimeRemaining(content: ContentContact) {
    this.interval = setInterval(() => {
      this.hoursForMeeting = this._timeRemainingSrv.lookTimeRemaining(
        content.appointmentDate,
        content.startTime,
      );
      if (
        this.hoursForMeeting.status === 'FINISHED' ||
        this.hoursForMeeting.status === 'STARTED'
      ) {
        clearInterval(this.interval);
      }
    }, 1000);
    this.isOpen = true;
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
