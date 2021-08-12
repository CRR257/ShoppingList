import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { User } from 'src/app/shared/models/user.interface';

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
    this.authService.getAllUsers();
  }

  onLogin(form: User) {
    console.log('Form', form);
    this.authService
      .login(form)
      .then(result => {
        this.authService.setUserToLocalStorage();
      })
      .catch(error => {
        this.error = error;
      });
  }
}
