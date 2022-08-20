import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { ShoppingUser } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  emailIsVerified = false;
  error = '';

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.authService.logout();
  }

  onLogin(form: ShoppingUser) {
      this.authService
        .login(form)
        .then(user => {
          this.authService.setUserToLocalStorage(user);
        })
        .catch(error => {
          this.error = error;
        });
  }
}
