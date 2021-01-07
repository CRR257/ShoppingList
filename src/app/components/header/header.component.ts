import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.isUserLogged();
  }

  isUserLogged() {
    // this.authService.setUserToLocalStorage()
    this.user =  JSON.parse(localStorage.getItem('user'));
  }
}
