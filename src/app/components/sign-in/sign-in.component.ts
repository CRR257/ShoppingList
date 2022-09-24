import { Component} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {UserSingUpFormModel} from 'src/app/shared/models/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth-service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  error: string;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  async onUserSignIn(loginForm: UserSingUpFormModel) {
    try {
    const userData = await this.authService.signInUser(loginForm);
    if (userData) {
      await this.authService.setUserToLocalStorage(userData)
      await this.router.navigate(['shopping-list']);
    }
    } catch (err) {
      this.error = err;
    }
  }
}
