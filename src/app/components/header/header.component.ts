import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  //userLogged: any
  userLogged: User[] = [];
  nameUser: string = '';

  constructor(public authService: AuthService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getUser();
    this.getUserLogged();
  }

  getUser() {
    this.userLogged = JSON.parse(localStorage.getItem('user2'));
    this.nameUser = this.userLogged[0].displayName;
  }
  getUserLogged() {
    this.authService.watchStorage().subscribe((data:string) => {
      if (data === 'changed') {
        this.getUser();

      // console.log(this.userLogged)
      // console.log(this.userLogged[0].displayName)
      // this.nameUser = this.userLogged[0].displayName !== 'null'? this.userLogged[0].displayName: 'stranger';
      // localStorage.setItem('nameUser', JSON.stringify(this.nameUser));
      } else if (data === 'logout'){
        this.nameUser = '';
        this.userLogged = [];

      }
    })
    //   this.userLogged = user;
    //   console.log(user)
    // })
  }
}
