import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IUserStore, User } from '@app/auth/interfaces/user.interface';
import { AlertService, ProfileService } from '@app/services';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-profile-store',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-store.html',
})
export class ProfileStoreComponent {
  private _fb = inject(FormBuilder);
  userStore = signal<IUserStore | null>(null);
  _profileService = inject(ProfileService);
  _alertService = inject(AlertService);
  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    businessName: [''],
    tradeName: [''],
    displayName: [''],
    storeUrl: [''],
    address: [''],
  });

  ngOnInit() {
    this.getUserStoreProfile();
  }

  getUserStoreProfile() {
    this._profileService.getUserStoreProfile().subscribe({
      next: (profile) => {
        console.log(profile);
        this.userStore.set(profile);
        this.onEditForm(profile);
      },
      error: (error) => {
        console.error('Error fetching user store profile', error);
        this._alertService.getAlert(
          'Error',
          error.error?.detail || 'Error fetching user store profile',
          'error',
        );
      },
    });
  }

  onEditForm(profile: IUserStore) {
    this.myForm.patchValue({
      businessName: profile.businessName,
      tradeName: profile.tradeName,
      displayName: profile.displayName,
      storeUrl: profile.storeUrl,
      address: profile.address,
    });
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    this._profileService.patchUserStoreProfile(this.myForm.value).subscribe({
      next: (profile) => {
        console.log('Profile updated', profile);
        this.userStore.set(profile);
        this._alertService.getAlert(
          'Éxito',
          'Perfil de tienda actualizado correctamente',
          'success',
        );
      },
      error: (error) => {
        console.error('Error updating user store profile', error);
        this._alertService.getAlert(
          'Error',
          error.error?.detail || 'Error updating user store profile',
          'error',
        );
      },
    });
  }
}
