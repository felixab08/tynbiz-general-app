import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/auth/interfaces/user.interface';
import { AuthService } from '@app/auth/services/auth.service';
import { VerificationService } from '@app/services/general/verification.service';

@Component({
  selector: 'tyn-verification',
  imports: [],
  templateUrl: './verification.html',
})
export class Verification {
  private readonly route = inject(ActivatedRoute);
  readonly token = signal<string | null>(null);
  private readonly _verificationSrv = inject(VerificationService);
  private _authService = inject(AuthService);
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
          this._authService.handleAuthSuccess(
            response.user,
            response.accessToken,
          );
          setTimeout(() => {
            location.reload();
          }, 500);
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
