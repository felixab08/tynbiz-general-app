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

@Component({
  selector: 'tyn-card-contact-store-page',
  imports: [CommonModule, NotImagePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './card-contact-store-page.component.html',
})
export class CardContactStorePageComponent {
  listContact = input.required<ContentContact>();
  private _storeService = inject(StoreService);
  refreshToken: string | null = null;

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

  lookTimeRemaining(content: ContentContact) {
    console.log(content);
    if (content.appointmentDate === new Date().toISOString().split('T')[0]) {
      console.log('The appointment date is today.');
    }
  }
}

