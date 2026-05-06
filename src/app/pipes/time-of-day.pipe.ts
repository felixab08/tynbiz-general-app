import { Pipe, PipeTransform } from '@angular/core';
import { TimeOfDay } from '@app/interfaces/stores/calendar.interface';

@Pipe({
  name: 'timeOfDay',
  standalone: true,
})
export class TimeOfDayPipe implements PipeTransform {
  transform(time: TimeOfDay | null | undefined): string {
    if (!time) {
      return '--:--';
    }

    const hour = String(time.hour).padStart(2, '0');
    const minute = String(time.minute).padStart(2, '0');
    const ampm = time.hour >= 12 ? 'pm' : 'am';
    const displayHour = time.hour % 12 || 12;

    return `${displayHour}:${minute} ${ampm}`;
  }
}
