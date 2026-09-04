import { Service } from '@angular/core';
import { ContentContact } from '@app/interfaces';

@Service()
export class TimeRemainingService {
  lookTimeRemaining(
    appointmentDate: string,
    startTime: string,
    videoRoomUrl: string = '',
  ): any {
    const now = new Date();
    const [year, month, day] = appointmentDate.split('-').map(Number);
    const [hours, minutes, seconds = 0] = startTime.split(':').map(Number);
    const meetingDate = new Date(year, month - 1, day, hours, minutes, seconds);

    const diffMs = meetingDate.getTime() - now.getTime();
    if (diffMs < -1800000) {
      let hoursForMeeting = {
        status: 'FINISHED',
        message: 'La reunión ya finalizó.',
        timeRemaining: 'La reunión ya finalizó.',
        videoRoomUrl: videoRoomUrl,
      };
      return hoursForMeeting;
    }
    if (diffMs < 0 && diffMs > -1800000) {
      let hoursForMeeting = {
        status: 'STARTED',
        message: 'La reunión ya comenzó.',
        timeRemaining: 'La reunión ya comenzó.',
        videoRoomUrl: videoRoomUrl,
      };
      return hoursForMeeting;
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const daysRemaining = Math.floor(totalSeconds / 86400);
    const hoursRemaining = Math.floor((totalSeconds % 86400) / 3600);
    const minutesRemaining = Math.floor((totalSeconds % 3600) / 60);
    const secondsRemaining = totalSeconds % 60;

    const resultated = `Faltan ${daysRemaining} día${daysRemaining === 1 ? '' : 's'}, ${hoursRemaining} hora${hoursRemaining === 1 ? '' : 's'}, ${minutesRemaining} minuto${minutesRemaining === 1 ? '' : 's'} y ${secondsRemaining} segundo${secondsRemaining === 1 ? '' : 's'} para la reunión.`;

    let hoursForMeeting = {
      status: 'WAITING',
      message: 'Esperando a que la reunión comience...',
      timeRemaining: resultated,
      videoRoomUrl: videoRoomUrl,
    };
    return hoursForMeeting;
  }
}
