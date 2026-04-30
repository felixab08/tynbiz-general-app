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
import { AlertService } from '@app/services';
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
  publicationType = signal<'SOLO_PUBLICACION ' | 'EN_VIVO'>(
    'SOLO_PUBLICACION ',
  );
  scheduleEnabled = signal(false);
  _createCreation = inject(CreateCreation);
  _alertService = inject(AlertService);

  showAlert = signal(false);
  router = inject(Router);
  private _fb = inject(FormBuilder);
  formUtils = FormUtils;
  myFormCreations: FormGroup = this._fb.group({});
  ngOnInit(): void {
    this.createForm();
  }
  constructor() {
    effect(() => {
      if (this._createCreation.count() === 0) {
        setTimeout(() => this.showAlert.set(true), 500);
      } else {
        this.showAlert.set(false);
      }
    });
    console.log(this._createCreation.products());

  }

  goToProducts() {
    this.router.navigate(['/stores/products']);
  }
  nextStep() {
    if (this._createCreation.count() === 0) return;
    this.step.set('details');
  }

  backToProducts() {
    this.step.set('products');
  }
  onPublicationChange(value: string) {
    this.publicationType.set(value as 'SOLO_PUBLICACION ' | 'EN_VIVO');

    // resetear toggle y fecha/hora si cambia a "solo"
    if (value === 'SOLO_PUBLICACION ') {
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
    const products = this._createCreation.products();
    const newCreation = {
      ...formData,
      productIds: products.map((p) => p.id),
    };
    return newCreation;
  }

  publishCreation() {
    if (this.myFormCreations.invalid) {
      this.myFormCreations.markAllAsTouched();
      return;
    }
    const payload = this.buildNewCreation();
    this._createCreation.postRegisterCreations(payload).subscribe({
      next: (resp) => {
        this._alertService.getAlert(
          'Creación registrada con éxito:',
          'Tu creación ha sido registrada exitosamente.',
          'success',
        );
        this._createCreation.clear();
        localStorage.removeItem('creation_creation');
        this.router.navigate(['/stores/products']);
      },
      error: (err) => {
        console.error('Error al registrar la creación:', err);
      },
    });
    console.log('Payload enviado:', payload);
  }
}
