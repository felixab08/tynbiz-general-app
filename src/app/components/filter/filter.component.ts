import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tyn-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
})
export class FilterComponent {
  inputFilter = output<string>();
  selectFilter = output<string>();

  placeholder = input<string>('Buscar');
  initialValue = input<string>('');

  startDate: string = '';
  endDate: string = '';
  isState = 'All';

  filterMenu = input.required<any>();

  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  filterByStatus(status: string): void {
    status = status === 'All' ? '' : status;
    this.selectFilter.emit(status);
  }
  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.inputFilter.emit(value);
    }, 500);
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
