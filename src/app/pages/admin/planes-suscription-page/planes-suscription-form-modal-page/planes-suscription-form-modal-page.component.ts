import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-planes-suscription-form-modal-page',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './planes-suscription-form-modal-page.component.html',
})
export class PlanesSuscriptionFormModalPageComponent {
  @Input() visible: boolean = false;
  @Input() selectedPlan: any = null; // Si es null, es modo crear
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private _fb = inject(FormBuilder);
  formUtils = FormUtils;
  myForm: FormGroup = this._fb.group({});

  namePlan = signal('');
  descriptionPlan = signal('');
  price = signal(0);
  coin = signal('S/.');
  selectedTypePlan = signal('uso de tynbiz');
  isOffer = signal(false);
  discount = signal(0);
  promoDays = signal(0);
  estado = signal('activo');

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPlan'] || changes['visible']) {
      this.initForm();
    }
  }

  initForm() {
    if (this.selectedPlan) {
      // Modo editar
      this.namePlan.set(this.selectedPlan.name);
      this.descriptionPlan.set(this.selectedPlan.description);
      this.price.set(this.selectedPlan.price);
      this.coin.set(this.selectedPlan.currency);
      this.selectedTypePlan.set(this.selectedPlan.billingCycle);
      this.estado.set(this.selectedPlan.isActive);
      this.isOffer.set(this.selectedPlan.hasPromotion === 'true' || this.selectedPlan.hasPromotion === true);
      this.discount.set(this.selectedPlan.discountPercentage || 0);
      this.promoDays.set(this.selectedPlan.discountDays || 0);
      this.myForm = this._fb.group({
        name: [this.selectedPlan.name || '', [Validators.required]],
        description: [this.selectedPlan.description || ''],
        billingCycle: [this.selectedPlan.billingCycle || '', [Validators.required]],
        currency: [this.selectedPlan.currency || ''],
        price: [this.selectedPlan.price || '', [Validators.required]],
        isActive: [this.selectedPlan.isActive || '', [Validators.required]],
        hasPromotion: [this.selectedPlan.hasPromotion || false, [Validators.required]],
        discountPercentage: [this.selectedPlan.discountPercentage || ''],
        discountDays: [this.selectedPlan.discountDays || ''],
      });
    } else {
      // Modo nuevo plan
      this.namePlan.set('');
      this.descriptionPlan.set('');
      this.price.set(0);
      this.coin.set('USD');
      this.selectedTypePlan.set('PAY_PER_USE');
      this.estado.set('true');
      this.isOffer.set(false);
      this.discount.set(0);
      this.promoDays.set(0);
      this.myForm = this._fb.group({
        name: ['', [Validators.required]],
        description: [''],
        billingCycle: ['', [Validators.required]],
        currency: [''],
        price: ['', [Validators.required]],
        isActive: ['', [Validators.required]],
        hasPromotion: [false, [Validators.required]],
        discountPercentage: [''],
        discountDays: [''],
      });
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    const data = {
      name: this.namePlan(),
      description: this.descriptionPlan(),
      price: this.price(),
      currency: this.coin(),
      billingCycle: this.selectedTypePlan(),
      isActive: this.estado().toLowerCase() === 'true',
      hasPromotion: this.isOffer() ? true : false,
      discountPercentage: this.discount(),
      discountDays: this.promoDays(),
    };
    this.save.emit(data);
  }
}
