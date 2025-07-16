import { NgClass } from '@angular/common';
import {
  Component,
  computed,
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
  changePageSelect = output<number>();

  itemsPage = signal(5);
  currentPage = input<number>(1);
  currentSize = input<number>(5);
  activePage = linkedSignal(this.currentPage);
  activeSize = linkedSignal(this.currentSize);

  constructor(private router: Router) {}

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });

  getSizeList = computed(() => {
    return Array.from([2, 3, 5, 10, 15, 20, 50]);
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

  get itemsPageValue() {
    return this.itemsPage();
  }

  set itemsPageValue(val: number) {
    this.itemsPage.set(val);
    this.changePageSelect.emit(val);
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
    this.router.navigate([], {
      queryParams: { size: newSize, page: this.activePage() },
      queryParamsHandling: 'merge',
    });
  }
}
