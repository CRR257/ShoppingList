import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

import {
  UserSingInFormModel,
  UserModel,
  UserStatus,
  UserSingUpFormModel,
} from 'src/app/shared/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new Subject<string>();

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {}

  watchStorage(): Observable<any> {
    return this.user$.asObservable();
  }

  async signInUser(user: UserSingInFormModel): Promise<UserModel> {
    const { email, password } = user;
    const userId = await this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userLogged) => userLogged.user?.uid);
    return this.afs.firestore
      .collection('users')
      .doc(userId)
      .get()
      .then((doc) => doc.data() as UserModel);
  }

  setUserToLocalStorage(userLogged: UserModel) {
    localStorage.setItem('user', JSON.stringify(userLogged));
    this.user$.next('userLogIn');
  }

  signUpUser(user: UserSingUpFormModel) {
    const { email, password } = user;
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['/verify-email-address']);
      });
  }

  forgotPassword(passwordResetEmail: any) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail.email);
  }

  getUserLogged() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.user$.next(UserStatus.userLogout);
      this.router.navigate(['/sign-in']);
    });
  }
}
