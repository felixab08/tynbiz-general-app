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
  dateInitialFilter = output<string>();
  dateEndFilter = output<string>();

  placeholder = input<string>('Buscar');
  initialValue = input<string>('');
  initialDateStartValue = input<string>('');
  initialDateEndValue = input<string>('');

  startDate: string = '';
  endDate: string = '';
  isState = 'All';

  filterMenu = input.required<any>();

  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');
  selectInitValue = linkedSignal<string>(
    () => this.initialDateStartValue() ?? ''
  );
  selectEndValue = linkedSignal<string>(() => this.initialDateEndValue() ?? '');

  filterByStatus(status: string): void {
    status = status === 'All' ? '' : status;
    this.selectFilter.emit(status);
  }
  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const valueStart = this.selectInitValue();
    const valueEnd = this.selectEndValue();
    const timeout = setTimeout(() => {
      this.inputFilter.emit(value);
      this.dateInitialFilter.emit(valueStart);
      this.dateEndFilter.emit(valueEnd);
    }, 500);
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
