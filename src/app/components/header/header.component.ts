import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { ShoppingUser } from '../../shared/models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userLogged: ShoppingUser;

  constructor( public authService: AuthService ) {}

  ngOnInit(): void {
    this.getUserLogged();
  }

  // getUserLogged() {
  //   this.authService.watchStorage().subscribe((data: string) => {
  //     console.log('data', data)
  //     if (data === 'userSignedIn') {
  //       this.userLogged = this.authService.getUserLogged();
  //     } else if (data === 'userLogout') {
  //       this.userLogged = null;
  //     }
  //   });
  // }

  getUserLogged() {
    this.userLogged = this.authService.getUserLogged();
  }
}
