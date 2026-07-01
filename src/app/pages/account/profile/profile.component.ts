import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '@app/auth/interfaces/user.interface';
import { IProfile, IProfileAvatar } from '@app/interfaces';
import { NotImagePipe } from '@app/pipes';
import { AlertService, ProfileService } from '@app/services';
import { FormUtils } from '@app/utils/form.util';

@Component({
  selector: 'tyn-profile',
  imports: [ReactiveFormsModule, CommonModule, NotImagePipe],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private _fb = inject(FormBuilder);
  user = input.required<User | undefined>();
  _profileService = inject(ProfileService);
  _alertService = inject(AlertService);
  urlImage = './assets/img/log-4.jpg';
  ngOnInit() {
    this._profileService.getUserProfile().subscribe({
      next: (profile) => {
        console.log(profile);
        this.urlImage = profile.avatarUrl || '';
        this.onEditForm(profile);
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
        this._alertService.getAlert(
          'Error',
          'Error fetching user profile',
          'error',
        );
      },
    });
  }

  formUtils = FormUtils;

  myForm: FormGroup = this._fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    gender: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    documentNumber: ['', [Validators.required]],
    documentType: ['DNI'],
    phone: [
      ,
      [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
    ],
    birthDate: [
      '',
      [
        Validators.required,
        FormUtils.dataMaxToday(),
        FormUtils.edadMinimaValidator(18),
      ],
    ],
  });

  onEditForm(profile: IProfile) {
    this.myForm.patchValue(profile);
  }

  changeAvatarFile(event: any) {
    const file = event.target.files[0];
    console.log('Selected file:', file);
    if (file) {
      const avatar: IProfileAvatar = {
        fileName: file.name,
        contentType: file.type,
        uploadType: 'AVATAR',
      };
      this._profileService.postUserProfileAvatar(avatar).subscribe({
        next: (profile) => {
          console.log('Avatar updated', profile);
        },
        error: (error) => {
          console.error('Error updating avatar', error);
        },
      });
    }
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    const profile: IProfile = this.myForm.value;
    profile.documentType = 'DNI'; // Set the documentType to 'DNI' before sending the request
    this._profileService.patchUserProfile(profile).subscribe({
      next: (updatedProfile) => {
        console.log('Profile updated', updatedProfile);
        this._alertService.getAlert(
          'Success',
          'Profile updated successfully',
          'success',
        );
      },
      error: (error) => {
        this._alertService.getAlert('Error', 'Error updating profile', 'error');
        console.error('Error updating profile', error);
      },
    });
  }
}
