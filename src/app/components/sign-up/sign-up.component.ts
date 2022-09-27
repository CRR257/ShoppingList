import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserSingUpFormModel } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  error = '';

  registerForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(public authService: AuthService) {}

  onUserSignUp(form: UserSingUpFormModel) {
    this.authService
      .signUpUser(form)
      .then((result) => {
        this.authService.sendVerificationMail();
      })
      .catch((error) => {
        this.error = error;
      });
  }
}
