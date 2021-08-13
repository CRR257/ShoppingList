import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  error = '';

  registerForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  register(form: User) {
    this.authService
      .register(form)
      .then(result => {
        this.authService.sendVerificationMail();
        this.authService.setUserData(result.user, form.displayName);
      })
      .catch(error => {
        this.error = error;
      });
  }
}
