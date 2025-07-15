import { NgClass } from '@angular/common';
import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [NgClass, RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
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
}
