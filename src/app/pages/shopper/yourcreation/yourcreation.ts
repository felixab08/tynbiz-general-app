import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  AlertService,
  CreationsService,
  JitsiService,
  TimeRemainingService,
} from '@app/services';
import { CarouselProductsCreation, TitleComponent } from '@app/components';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
  selector: 'tyn-your-creation',
  imports: [
    NgClass,
    CarouselProductsCreation,
    ModalComponent,
    DatePipe,
    TitleComponent,
  ],
  templateUrl: './yourcreation.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export default class YourCreation {
  _CreationsSrv = inject(CreationsService);
  private _jitsiSrv = inject(JitsiService);
  private _alertSrv = inject(AlertService);
  private _timeRemainingSrv = inject(TimeRemainingService);
  isOpen = false;

  private interval: any;
  hoursForMeeting = {
    status: 'WAITING',
    message: 'Calculando...',
    timeRemaining: 'Espere.',
    videoRoomUrl: '',
  };

  creationsResource = rxResource({
    params: () => ({
      page: 0,
      size: 100,
    }),
    stream: ({ params }) => {
      return (
        this._CreationsSrv.getYourCreations({
          page: params.page,
          size: params.size,
          startDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
        }) || {}
      );
    },
  });
  createJitsi(videoRoomUrl: any) {
    console.log(videoRoomUrl);

    this._jitsiSrv.createJitsi(videoRoomUrl);
  }

  lookTimeRemaining(content: any) {
    const [fecha, hora] = content.scheduledAt.split('T');

    this.interval = setInterval(() => {
      this.hoursForMeeting = this._timeRemainingSrv.lookTimeRemaining(
        fecha,
        hora,
        content.videoRoomUrl,
      );
      this.isOpen = true;
      if (
        this.hoursForMeeting.status === 'FINISHED' ||
        this.hoursForMeeting.status === 'STARTED'
      ) {
        clearInterval(this.interval);
      }
    }, 1000);
  }
  deleteCreation(id: any) {
    this._CreationsSrv.deleteInteractionRoom(id).subscribe({
      next: () => {
        this._alertSrv.getAlert(
          'Eliminado',
          'La creación ha sido eliminada correctamente.',
          'success',
        );
        this.creationsResource.reload();
      },
      error: (err) => {
        this._alertSrv.getAlert(
          'Error',
          'Ocurrió un error al eliminar la creación.',
          'error',
        );
      },
    });
  }

  closeModal() {
    this.isOpen = false;
    clearInterval(this.interval);
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
