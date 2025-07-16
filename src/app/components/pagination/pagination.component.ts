import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [NgClass, RouterLink, FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input(0);
  totalElements = input(0);
  currentPage = input<number>(1); // N° de paginas
  currentSize = input<number>(5); // Cantidad de Datos que desea que venga en lista

  itemsPage = signal(5);

  activePage = linkedSignal(this.currentPage);
  activeSize = linkedSignal(this.currentSize);

  _router = inject(Router);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });

  // TODO: mirar cuando se tiene mas datos
  getSizeList = computed(() => {
    const sizes = [5, 10, 25, 50];
    return [
      5,
      ...sizes.filter((size) => this.totalElements() * 2 >= size && size !== 5),
    ];
  });

  previousPage() {
    if (this.activePage() > 1) {
      this.activePage.set(this.activePage() - 1);
    }
  }

  nextPage() {
    const pages = this.getPagesList();
    if (this.activePage() < pages[pages.length - 1]) {
      this.activePage.set(this.activePage() + 1);
    }
  }

  get activeSizeValue() {
    return this.activeSize();
  }
  set activeSizeValue(val: number) {
    this.activeSize.set(val);
  }

  onSizeChange(newSize: number) {
    this.activePage.set(1);
    this.activeSize.set(newSize);
    this._router.navigate([], {
      queryParams: { size: newSize, page: this.activePage() },
      queryParamsHandling: 'merge',
    });
  }
}
