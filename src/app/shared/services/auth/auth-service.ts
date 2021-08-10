import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: User;
  users: User[] = [];
  userLogged = {};

  private storageSub = new Subject<string>();

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {}

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  getAllUsers() {
    this.getUsers().subscribe(apps => {
      this.users = apps;
    });
  }

  setUserToLocalStorage() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userLogged = {};
        this.userData = user;
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].uid === user.uid) {
            this.userLogged = this.users[i];
          }
        }
        const localStorage1 = new Promise((resolve, reject) => {
          if (this.userLogged) {
            localStorage.setItem('userLogged', JSON.stringify(this.userLogged));
            resolve();
          } else {
            reject('error');
          }
        });

        const yell = new Promise((resolve, reject) => {
          this.ngZone.run(() => {
            this.router.navigate(['shopping-list']);
          });
          resolve();
        });

        async function userToLocal() {
          try {
            await localStorage1;
            await yell;
          } catch (error) {
            return error;
          }
        }

        (async () => {
          await userToLocal();
          this.storageSub.next('userSignedIn');
        })();
      }
    });
  }

  setUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.setItem('userLogged', JSON.stringify(this.userLogged));
      resolve();
    });
  }

  getUsers(): Observable<User[]> {
    return this.afs
      .collection('users')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  login(user: User) {
    const { email, password } = user;
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  register(user: User) {
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
    // return (user !== null && user.emailVerified !== false) ? true : false;
  }

  getUserLogged() {
    return JSON.parse(localStorage.getItem('userLogged'));
  }

  AuthLogin(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
        this.setUserData(result.user);
      })
      .catch(error => {
        window.alert(error);
      });
  }

  setUserData(user: User, name?) {
    const userData: User = {
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
