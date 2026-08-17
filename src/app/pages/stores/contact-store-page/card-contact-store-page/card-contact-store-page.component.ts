import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ContentContact } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes';
import { ContactService, StoreService } from '@app/services';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
  selector: 'tyn-card-contact-store-page',
  imports: [CommonModule, NotImagePipe, ModalComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './card-contact-store-page.component.html',
})
export class CardContactStorePageComponent {
  listContact = input.required<ContentContact>();
  private _storeService = inject(StoreService);
  _contactService = inject(ContactService);

  refreshToken: string | null = null;
  isOpen = false;
  hoursForMeeting = {
    status: 'WAITING',
    message: 'Esperando a que la reunión comience...',
    timeRemaining: 'La reunión aún no ha comenzado.',
  };
  constructor() {
    this._storeService.refreshTokenSubject.subscribe((refreshToken) => {
      this.refreshToken = refreshToken;
      console.log(this.refreshToken);
    });
  }

  createJitsi(videoRoomUrl: string) {
    const url = `${videoRoomUrl}` + `?code=${this.refreshToken}`;
    window.open(url, '_blank');
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
  }
  /**
   * se debe mostrar un modal cuando la fecha de la cita sea igual a la fecha actual y mostrar el tiempo restante para la reunión.
   * si la hora de la cita coincide con la hora actual, se debe mostrar un mensaje indicando que la reunión ya comenzó.
   * si la hora de la cita es menor a la hora actual por una hora, se debe mostrar un mensaje indicando que la reunión finalizó.
   * @param content
   */

  lookTimeRemaining(content: ContentContact) {
    if (content.appointmentDate === new Date().toISOString().split('T')[0]) {
      console.log('The appointment date is today.');
      this.isOpen = true;
      const now = new Date();
      const [hours, minutes] = content.startTime.split(':').map(Number);
      const meetingDate = new Date();
      meetingDate.setHours(hours, minutes, 0, 0);

      const diffMs = meetingDate.getTime() - now.getTime();
      if (diffMs < -1800000) {
        this.hoursForMeeting.status = 'FINISHED';
        this.hoursForMeeting.message = 'La reunión ya finalizó.';
        this.hoursForMeeting.timeRemaining = 'La reunión ya finalizó.';
        return;
      }
      if (diffMs < 0 && diffMs > -1800000) {
        this.hoursForMeeting.status = 'STARTED';
        this.hoursForMeeting.message = 'La reunión ya comenzó.';
        this.hoursForMeeting.timeRemaining = 'La reunión ya comenzó.';
        return;
      }
      const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
      const hoursRemaining = Math.floor(totalMinutes / 60);
      const minutesRemaining = totalMinutes % 60;
      console.log(totalMinutes);

      const resultated =
        diffMs > 0
          ? hoursRemaining > 0
            ? `Faltan ${hoursRemaining} hora${hoursRemaining === 1 ? '' : 's'} y ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'} para la reunión.`
            : `Faltan ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'} para la reunión.`
          : hoursRemaining > 0
            ? `La reunión ya comenzó hace ${hoursRemaining} hora${hoursRemaining === 1 ? '' : 's'} y ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'}.`
            : `La reunión ya comenzó hace ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'}.`;

      this.hoursForMeeting = {
        status: 'WAITING',
        message: 'Esperando a que la reunión comience...',
        timeRemaining: resultated,
      };
    }
  }
}
