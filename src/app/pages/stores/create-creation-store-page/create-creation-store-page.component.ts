import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CarouselProductsCreation } from '@app/components/carousel-products-creation/carousel-products-creation.component';
import { ProductDetailCardComponent } from '@app/components/product-detail-card/product-detail-card.component';
import { CreateCreation } from '@app/services/stores/create-creation.service';
import { FormUtils } from '@app/utils/form.util';
type CreationStep = 'products' | 'details';
@Component({
  selector: 'tyn-create-creation-store-page',
  imports: [
    CarouselProductsCreation,
    ProductDetailCardComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './create-creation-store-page.component.html',
})
export default class CreateCreationStorePage {
  step = signal<CreationStep>('products');
  publicationType = signal<'solo' | 'vivo'>('solo');
  scheduleEnabled = signal(false);

  showAlert = signal(false);

  private _fb = inject(FormBuilder);
  formUtils = FormUtils;
  myFormCreations: FormGroup = this._fb.group({});
  ngOnInit(): void {
    this.createForm();
  }
  constructor(
    public createCreation: CreateCreation,
    private router: Router,
  ) {
    effect(() => {
      if (this.createCreation.count() === 0) {
        setTimeout(() => this.showAlert.set(true), 500);
      } else {
        this.showAlert.set(false);
      }
    });
  }

  goToProducts() {
    this.router.navigate(['/stores/products']);
  }
  nextStep() {
    if (this.createCreation.count() === 0) return;
    this.step.set('details');
  }

  backToProducts() {
    this.step.set('products');
  }
  onPublicationChange(value: string) {
    this.publicationType.set(value as 'solo' | 'vivo');

    // resetear toggle y fecha/hora si cambia a "solo"
    if (value === 'solo') {
      this.scheduleEnabled.set(false);
    }
  }

  toggleSchedule() {
    this.scheduleEnabled.update((v) => !v);
  }

  createForm() {
    this.myFormCreations = this._fb.group({
      title: ['', [Validators.required]],
      contentDetail: ['', [Validators.required]],
      publicationOption: ['', [Validators.required]],
      startDate: ['', [this.formUtils.dateMinToday()]],
      startTime: [''],
    });
  }

  buildNewCreation() {
    const formData = this.myFormCreations.value;
    const products = this.createCreation.products();
    const newCreation = {
      ...formData,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        storeId: p.storeId,
        storeName: p.storeName,
        description: p.description,
        stock: p.stock,
        categoryCatId: p.categoryCatId,
        sizes: p.sizes,
        colors: p.colors,
        originalPrice: p.originalPrice,
        discountPrice: p.discountPrice,
        currentPrice: p.currentPrice,
        discountPercentage: p.discountPercentage,
        mediaUrls: p.mediaUrls,
        productUrl: p.productUrl,
        isActive: p.isActive,
        featured: p.featured,
        inStock: p.inStock,
        hasDiscount: p.hasDiscount,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        createdBy: p.createdBy,
      })),
    };
    return newCreation;
  }

  publishCreation() {
    if (this.myFormCreations.invalid) {
      this.myFormCreations.markAllAsTouched();
      return;
    }
    const payload = this.buildNewCreation();
    console.log('Payload enviado:', payload);
  }
}
