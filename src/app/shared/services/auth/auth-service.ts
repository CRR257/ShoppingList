import { Injectable, NgZone } from '@angular/core';
import { User } from "../../models/user.interface";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { ShoppingListService } from '../shoppinglist/shoppinglist.service';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: User; // Save logged in user data (abans era any)
  //public userData: Observable<firebase.User>; // Save logged in user data


  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    //this.userData = afAuth.aut,hState;
    this.setUserToLocalStorage();
  }

  setUserToLocalStorage() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }
  // Sign in with email/password
  login(user: User) {
    const {email, password} = user;
    return this.afAuth.signInWithEmailAndPassword(email, password);
  };

  // Sign up with email/password
  register(user: User) {
    const {email, password} = user;
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  };

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return this.afAuth.currentUser.then(u => u.sendEmailVerification())
    .then(() => {
      this.router.navigate(['verify-email-address']);
    })
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail.email);
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

//   // Sign in with Google
//   GoogleAuth() {
//     return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
//     //return firebase.auth().signInWithPopup((new firebase.auth.GoogleAuthProvider()));
//   }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.setUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: User, name?) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    }

    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    })
 }



}
