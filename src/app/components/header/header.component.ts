import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userLogged: User;

  constructor( public authService: AuthService ) {}

  ngOnInit(): void {
    this.getUserLogged();
  }

  getUserLogged() {
    this.authService.watchStorage().subscribe((data: string) => {
      if (data === 'userSignedIn') {
        this.userLogged = this.authService.getUserLogged();
      } else if (data === 'userLogout') {
        this.userLogged = null;
      }
    });
  }
}
