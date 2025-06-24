import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tyn-planes-suscription-form-modal-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './planes-suscription-form-modal-page.component.html',
})
export class PlanesSuscriptionFormModalPageComponent {
  @Input() visible: boolean = false;
  @Input() selectedPlan: any = null; // Si es null, es modo crear
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

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
      this.namePlan.set(this.selectedPlan.planName);
      this.descriptionPlan.set(this.selectedPlan.planDescription);
      this.price.set(this.selectedPlan.planPrice);
      this.coin.set(this.selectedPlan.planCoin);
      this.selectedTypePlan.set(this.selectedPlan.planType);
      this.estado.set(this.selectedPlan.planState);
      this.isOffer.set(this.selectedPlan.promotional === 'true');
      this.discount.set(this.selectedPlan.percentage || 0);
      this.promoDays.set(this.selectedPlan.promDuration || 0);
    } else {
      // Modo nuevo plan
      this.namePlan.set('');
      this.descriptionPlan.set('');
      this.price.set(0);
      this.coin.set('USD');
      this.selectedTypePlan.set('uso de tynbiz');
      this.estado.set('activo');
      this.isOffer.set(false);
      this.discount.set(0);
      this.promoDays.set(0);
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    const data = {
      id: this.selectedPlan?.id || Date.now(), // solo si es nuevo
      planName: this.namePlan(),
      planDescription: this.descriptionPlan(),
      planPrice: this.price(),
      planCoin: this.coin(),
      planType: this.selectedTypePlan(),
      planState: this.estado(),
      promotional: this.isOffer() ? 'true' : 'false',
      percentage: this.discount(),
      promDuration: this.promoDays(),
      planDate: new Date().toISOString().split('T')[0],
    };
    this.save.emit(data);
  }
 }
