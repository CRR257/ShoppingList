import { Injectable, NgZone } from '@angular/core';
import { User } from "../../models/user.interface";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {ourkeys} from '../../../../environments/environment';
import * as firebase from 'firebase';
import { ShoppingListService } from '../shoppinglist/shoppinglist.service';
import { EmailValidator } from '@angular/forms';
import { TouchSequence } from 'selenium-webdriver';
import * as groupBy from "lodash/groupBy";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: User; // Save logged in user data (abans era any)
  users: User[] = [];
  userLogged = [];
  //public userData: Observable<firebase.User>; // Save logged in user data
  private storageSub= new Subject<String>();

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) { }

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  getAllUsers() {
    this.getUsers().subscribe(apps => {
      this.users = apps;
    })
  }

  setUserToLocalStorage() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
      this.userLogged = [];
       this.userData = user;
        if (user.uid === ourkeys.uid1 || ourkeys.uid2) {  // change for new users
        // if (user.uid === ourkeys.uid1 || ourkeys.uid2) {  // change for new users
          for (let i = 0; i< this.users.length; i++) {
            if (this.users[i].uid === user.uid) {
              this.userLogged.push(this.users[i])
            }
          }
          //this.userLogged.push(user)
        }
        console.log(this.userLogged)
        localStorage.setItem('user', JSON.stringify(this.userLogged));
        this.storageSub.next('changed');
        // console.log(JSON.stringify(this.users))
        // console.log(this.users)
      } else {
        localStorage.clear();
        //localStorage.setItem('user', null);
        //JSON.parse(localStorage.getItem('user'));
      }
    })
  }


getUsers(): Observable<User[]> {
    return this.afs
      .collection("users")
      .snapshotChanges()
      .pipe(
        map(actions => actions.map( a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return {id, ...data}
        }))
      )
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

    this.afs
    .collection('users')
    .doc(userData.uid)
    .set(userData, { merge: true })
    // return userRef.set(userData, {
    //   merge: true
    // })

    //https://angularquestions.com/2021/01/02/catching-errors-in-async-functions-in-an-async-function/
  }

  // Sign out
  logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.clear();
      // this.userLogged = []
      // localStorage.setItem('user', JSON.stringify(this.userLogged));
      //localStorage.removeItem('user');
      this.storageSub.next('logout');
      this.router.navigate(['sign-in']);
    })
 }



}
