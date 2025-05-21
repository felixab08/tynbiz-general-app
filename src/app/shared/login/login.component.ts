import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'tyn-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
}
