import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ContentContact } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes';
import { StoreService } from '@app/services';
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
  refreshToken: string | null = null;
  isOpen = false;
  hoursForMeeting: string | null = null;
  constructor() {
    this._storeService.refreshTokenSubject.subscribe((refreshToken) => {
      this.refreshToken = refreshToken;
      console.log(this.refreshToken);
    });
  }

  createJitsi(videoRoomUrl: string) {
    const url = `${videoRoomUrl}` + `?code=${this.refreshToken}`;
    window.open(url, '_blank');
  }
  closeModal() {
    this.isOpen = false;
  }

  lookTimeRemaining(content: ContentContact) {
    if (content.appointmentDate === new Date().toISOString().split('T')[0]) {
      console.log('The appointment date is today.');
      this.isOpen = true;
      const now = new Date();
      const [hours, minutes] = content.startTime.split(':').map(Number);
      const meetingDate = new Date();
      meetingDate.setHours(hours, minutes, 0, 0);

      const diffMs = meetingDate.getTime() - now.getTime();
      const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
      const hoursRemaining = Math.floor(totalMinutes / 60);
      const minutesRemaining = totalMinutes % 60;

      this.hoursForMeeting =
        diffMs > 0
          ? hoursRemaining > 0
            ? `Faltan ${hoursRemaining} hora${hoursRemaining === 1 ? '' : 's'} y ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'} para la reunión.`
            : `Faltan ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'} para la reunión.`
          : hoursRemaining > 0
            ? `La reunión ya comenzó hace ${hoursRemaining} hora${hoursRemaining === 1 ? '' : 's'} y ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'}.`
            : `La reunión ya comenzó hace ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'}.`;

      console.log(this.hoursForMeeting);
    }
  }
}
