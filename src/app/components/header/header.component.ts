import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { AuthService } from "src/app/shared/services/auth/auth-service";
import { User } from "../../shared/models/user.interface";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  userLogged: User[] = [];
  nameUser: string = "";

  constructor( public authService: AuthService ) {}

  ngOnInit(): void {
    this.getUser();
    this.getUserLogged();
  }

  getUser() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    if (this.userLogged) {
      this.nameUser = this.userLogged[0].displayName;
    }
  }

  getUserLogged() {
    this.authService.watchStorage().subscribe((data: string) => {
      if (data === "userSignedIn") {
        this.getUser();
      } else if (data === "userLogout") {
        this.nameUser = "";
        this.userLogged = [];
      }
    });
  }
}
