import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'tyn-title',
  imports: [],
  templateUrl: './title.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TitleComponent {
  _location = inject(Location);
  title = input<string>('');
  subtitle = input<string>('');
}
