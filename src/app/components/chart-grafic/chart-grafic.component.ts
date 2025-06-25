import {
  Component,
  input,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { colorUtil } from '@app/utils/color.util';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'tyn-chart-grafic',
  imports: [FormsModule],
  templateUrl: './chart-grafic.component.html',
})
export class ChartGraficComponent implements AfterViewInit, OnChanges {
  isDataStatistic = input.required<any>();
  itemsPerPage = 'bar';

  chart: any;
  config: any;

  ngAfterViewInit() {
    // Inicializar el chart cuando el DOM esté listo
    if (this.isDataStatistic()) {
      this.onItemsPerPageChange(this.itemsPerPage);
    }
  }

  // Función para construir datasets dinámicamente
  buildDatasets() {
    const defaultColors = colorUtil;
    return this.isDataStatistic().datasets.map((ds: any, i: number) => {
      const color = defaultColors[i % defaultColors.length];
      return {
        label: ds.label,
        data: ds.data,
        backgroundColor:
          ds.backgroundColor ||
          (this.itemsPerPage === 'bar'
            ? color.backgroundColor
                .replace('rgb', 'rgba')
                .replace(')', ', 0.8)')
            : color.backgroundColor),
        borderColor: ds.borderColor || color.borderColor,
        borderWidth: 2,
        tension: 0.4, // Para gráficos de línea
      };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDataStatistic'] && this.isDataStatistic()) {
      // Usar setTimeout para asegurar que el DOM esté actualizado
      setTimeout(() => {
        this.onItemsPerPageChange(this.itemsPerPage);
      }, 0);
    }
  }

  onItemsPerPageChange(value: any) {
    this.itemsPerPage = value;

    // Destruir el chart existente si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Verificar que el elemento canvas existe antes de crear el chart
    const canvasElement = document.getElementById(
      this.isDataStatistic().id
    ) as HTMLCanvasElement;
    if (!canvasElement) {
      console.error(
        `Canvas element with id '${this.isDataStatistic().id}' not found`
      );
      return;
    }

    this.config = {
      type: this.itemsPerPage,
      data: {
        labels: this.isDataStatistic().labels,
        datasets: this.buildDatasets(),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    };

    try {
      this.chart = new Chart(canvasElement, this.config);
    } catch (error) {
      console.error('Failed to create chart:', error);
    }
  }
}
