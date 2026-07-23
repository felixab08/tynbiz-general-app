import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUserStore } from '@app/auth/interfaces/user.interface';
import { IProfileAvatar, IRespProfileAvatar } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes';
import { AlertService, ProfileService } from '@app/services';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-info-store-page',
  imports: [NotImagePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './info-store-page.component.html',
})
export default class InfoStorePageComponent {
  private _fb = inject(FormBuilder);
  urlImage = signal<string>('');
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
        console.log('User store profile fetched', profile);
        this.userStore.set(profile);
        this.onEditForm(profile);
        this.urlImage.set(profile.logo || '');
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

  changeAvatarFile(event: any) {
    const file = event.target.files[0];
    console.log('Selected file:', file);
    if (file) {
      const avatar: IProfileAvatar = {
        // url: URL.createObjectURL(file),
        fileName: file.name,
        contentType: file.type,
        uploadType: 'STORE_LOGO',
      };
      console.log(avatar);
      this._profileService.postUserProfileAvatar(avatar).subscribe({
        next: (profile) => {
          console.log('Avatar updated', profile);
          if (file) {
            // Enviar el File directamente al servicio (no es necesario FileReader)
            this.uploadAvatarToStorage(profile, file);
          }
        },
        error: (error) => {
          console.error('Error updating avatar', error);
        },
      });
    }
  }

  uploadAvatarToStorage(resp: IRespProfileAvatar, file: File | Blob) {
    this._profileService.uploadImageToStorage(resp.uploadUrl, file).subscribe({
      next: (response) => {
        this.putUpdateStoreAvatar(resp.publicUrl);
      },
      error: (error) => {
        console.error('Error uploading avatar to storage', error);
      },
    });
  }
  putUpdateStoreAvatar(avatarUrl: string) {
    this._profileService.putUpdateStoreAvatar(avatarUrl).subscribe({
      next: (updatedProfile: any) => {
        console.log('Store logo updated', updatedProfile);
        this.urlImage.set(updatedProfile.logo || '');
      },
      error: (error) => {
        console.error('Error updating store logo', error);
      },
    });
  }
}
