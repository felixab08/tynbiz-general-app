import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IProduct } from '@app/interfaces';
import { Product } from '@app/interfaces/card.interface';
import { initCarousels } from 'flowbite';


@Component({
  selector: 'tyn-carousel-products-creation',
  imports: [CommonModule],
  templateUrl: './carousel-products-creation.component.html',
})
export class CarouselProductsCreation {
  listProduct = input.required<IProduct[]>();
  ngAfterViewInit(): void {
      initCarousels(); // inicializa el carrusel de Flowbite
    }
 }
