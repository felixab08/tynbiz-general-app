import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/auth/interfaces/user.interface';
import { AuthService } from '@app/auth/services/auth.service';
import { MenuService } from '@app/auth/services/menu.service';
import { VerificationService } from '@app/services/general/verification.service';

@Component({
  selector: 'tyn-verification',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './verification.html',
})
export class Verification {
  private readonly route = inject(ActivatedRoute);
  readonly token = signal<string | null>(null);
  private readonly _verificationSrv = inject(VerificationService);
  private _authService = inject(AuthService);
  private _menuService = inject(MenuService);
  user = signal<User | null>(null);

  constructor() {
    this.token.set(this.route.snapshot.queryParamMap.get('token'));
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.verifyEmail();
  }

  verifyEmail() {
    const tokenValue = this.token();
    if (tokenValue) {
      this._verificationSrv.postPlanes(tokenValue).subscribe({
        next: (response: any) => {
          console.log('Verification successful:', response);
          this.user.set(response.user);
          // Sin `location.reload()`: `establishSession` actualiza los signals y
          // `StoreService`, así que la navegación por rol basta.
          this._authService.establishSession(
            response.user,
            response.accessToken,
            response.refreshToken,
          );
          this._menuService.redirectLinkForRole();
        },
        error: (error) => {
          console.error('Verification failed:', error);
        },
      });
    } else {
      console.error('No token provided for verification.');
    }
  }
}
