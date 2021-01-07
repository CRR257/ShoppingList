import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  error: string = '';
  feedback: string = '';

  recoverForm = new FormGroup ({
    email: new FormControl('', Validators.required)
  });

  constructor(public authService: AuthService, public router: Router,
    public ngZone: NgZone) { }

  ngOnInit(): void {
  }

  onSign(form: User) {
    console.log('Form', form);
    this.authService.forgotPassword(form)
    .then((result) => {
      this.feedback = 'Email sent to rest your password, check your inbox :) ';
      this.error  = '';
    }).catch((error) => {
      this.error = error;
      this.feedback = '';
    })
  }
}
