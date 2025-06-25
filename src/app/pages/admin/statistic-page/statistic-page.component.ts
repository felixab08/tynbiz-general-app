import { Component } from '@angular/core';
import {
  generalMock,
  registerMock,
  storesMock,
  suscriptionMock,
  viewsMock,
} from '@app/mock/statistic.mock';
import { ChartGraficComponent } from '../../../components/chart-grafic/chart-grafic.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'tyn-statistic-page',
  imports: [ChartGraficComponent, CommonModule],
  templateUrl: './statistic-page.component.html',
})
export default class StatisticPageComponent {
  suscription = suscriptionMock;
  register = registerMock;
  views = viewsMock;
  stores = storesMock;
  general = generalMock;
  search = '';

  currentPage = 1;
  itemsPerPage = 5;
  get filteredData() {
    return this.general.filter((item) => {
      const matchesSearch = item.department
        .toLowerCase()
        .includes(this.search.toLowerCase());
      return matchesSearch;
    });
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }
  totalPages() {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }
  setPage(page: number) {
    this.currentPage = page;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }
}
