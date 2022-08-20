import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import { Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import { ShoppingUser } from '../../models/user.interface';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: ShoppingUser[] = [];
  userLogged = {};
  private user: firebase.User;

  private storageSub = new Subject<string>();

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  getAllUsers() {
    this.getUsers().subscribe(apps => {
      this.users = apps;
    });
  }

  setUserToLocalStorage(loggedUser) {
    this.afAuth.authState.subscribe(user => {
      localStorage.setItem('userLogged', JSON.stringify(user));
      this.router.navigate(['shopping-list']);
      // don't return the displayName. iterate through all users to get the name
    })
  }

  setUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      localStorage.setItem('userLogged', JSON.stringify(this.userLogged));
      resolve();
    });
  }

  getUsers(): Observable<ShoppingUser[]> {
    return this.afs
      .collection('users')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as ShoppingUser;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  login(user: ShoppingUser) {
    const { email, password } = user;
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
          .then(res => {
            resolve(res.user);
          }, err => reject(err))
    })
  }

  register(user: ShoppingUser) {
    const { email, password } = user;
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then(u => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['/verify-email-address']);
      });
  }

  forgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail.email);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
  }

  getUserLogged() {
    return JSON.parse(localStorage.getItem('userLogged'));
  }

  setUserData(user: ShoppingUser, name?) {
    const userData: ShoppingUser = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };

    this.afs
      .collection('users')
      .doc(userData.uid)
      .set(userData, { merge: true });
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userLogged');
      this.storageSub.next('userLogout');
      this.router.navigate(['/sign-in']);
    });
  }
}
