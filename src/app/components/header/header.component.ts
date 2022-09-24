import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';

import {UserModel, UserStatus} from 'src/app/shared/models/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userStatus: Observable<string>;
  userData: UserModel;

  constructor( public authService: AuthService ) {}

  ngOnInit(): void {
    this.isUserLogged();
  }

  isUserLogged() {
    this.userStatus = this.authService.watchStorage();
    this.userStatus.subscribe((userStatus) => {
      if(userStatus === UserStatus.userLogged) {
        this.userData = this.authService.getUserLogged();
      } else {
        this.userData = {} as UserModel;
      }
    } )
  }
}
