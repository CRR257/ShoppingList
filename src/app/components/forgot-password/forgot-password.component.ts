import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  error = '';
  feedback = '';

  recoverForm = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  constructor(public authService: AuthService, public router: Router) {}

  onSign(email: string) {
    this.authService
      .forgotPassword(email)
      .then(() => {
        this.feedback =
          'Email sent to rest your password, check your inbox :) ';
        this.error = '';
      })
      .catch((error) => {
        this.error = error;
        this.feedback = '';
      });
  }
}
