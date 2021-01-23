import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // let userLogged = JSON.parse(localStorage.getItem('nameUser'));
      // if(this.authService.isLoggedIn !== true) {
      //    return false;
      // } else if (userLogged) {
      //   return true;
      // }
      // else {
      //    this.router.navigate(['/sign-in'])
      // }
      //this.router.navigate(['/shopping-list'])
      return false;
    }
  //       if(this.authService.isLoggedIn !== true) {
  //       return false

  //     }
  //   this.router.navigate(['/shopping-list'])
  //   return true;
  // }


  // canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //     if(this.authService.isLoggedIn()) {
  //       this.router.navigate(['shopping-list'])
  //     }

  //   return true;
  // }

}
