import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  emailIsVerified: boolean = false;
  error: string = '';

  loginForm = new FormGroup ({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, public router: Router,
    public ngZone: NgZone) { }

  ngOnInit(): void {
    this.authService.getAllUsers();
   }

  onLogin(form: User) {
    console.log('Form', form);
    this.authService.login(form)
    .then((result) => {

      //this.authService.setUserData(result.user);
      this.authService.setUserToLocalStorage();

      this.ngZone.run(() => {
        this.router.navigate(['shopping-list']);
      });
    }).catch((error) => {
      this.error = error;
      console.log(error)
    })
  }

}
