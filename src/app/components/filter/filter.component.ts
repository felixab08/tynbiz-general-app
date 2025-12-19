import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  _activateRoute = inject(ActivatedRoute);
  _router = inject(Router);

  queryParam =
    this._activateRoute.snapshot.queryParamMap.get('status') ?? 'All';
  isState = linkedSignal(() => this.queryParam);

  filterMenu = input.required<any>();

  inputParam =
    this._activateRoute.snapshot.queryParamMap.get('searchTerm') ?? '';
  inputValue = linkedSignal<string>(
    () => this.inputParam ?? this.initialValue()
  );
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
      this.onChangeFilter(value);

      this.inputFilter.emit(value);
      this.dateInitialFilter.emit(valueStart);
      this.dateEndFilter.emit(valueEnd);
    }, 500);
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  onChangeFilter(searchTerm: string) {
    this._router.navigate([], {
      queryParams: {
        size: 5,
        page: 1,
        status: this.isState(),
        searchTerm: searchTerm,
      },
      queryParamsHandling: 'merge',
    });
  }
}
