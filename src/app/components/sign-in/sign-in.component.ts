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

  loginForm = new FormGroup ({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, public router: Router, 
    public ngZone: NgZone) { }

  ngOnInit(): void { }

  onLogin(form: User) {
    console.log('Form', form);
    this.authService.login(form)
    .then((result) => {
      //this.router.navigate(['dashboard']);
      // this.router.navigate(['/']);
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
      //this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error.message)
    })
    // this.authService.setUserToLocalStorage()
    // if (true) {
    //   alert(true)
    // }
    
    
    
  }

}
