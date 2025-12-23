import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Product } from '@app/interfaces/card.interface';
import { initCarousels } from 'flowbite';


@Component({
  selector: 'tyn-carousel-products-creation',
  imports: [CommonModule],
  templateUrl: './carousel-products-creation.component.html',
})
export class CarouselProductsCreation {
  listProduct = input.required<Product[]>();
  ngAfterViewInit(): void {
      initCarousels(); // inicializa el carrusel de Flowbite
    }
 }
