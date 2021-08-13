import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supermarket } from '../../models/supermarket.interface';
import {AuthService} from '../auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userId: string;
  supermarkets: Supermarket[] = [];
  userSupermarkets: AngularFirestoreCollection<{}>;
  supermarketUserIsEmpty: boolean;
  idSupermarketUser: string;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public authService: AuthService
  ) {
    this.userId = this.authService.getUserLogged().id;
    const supermarketsUser = 'supermarketsUserList-' + `${this.userId}`;
    this.userSupermarkets = afs.collection<{}>(supermarketsUser);
  }

  public getSupermarkets(): Observable<Supermarket[]> {
    return this.afs
      .collection('supermarket')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Supermarket;
            const id = a.payload.doc.id;
            return {id, ...data};
          })
        )
      );
  }

  public getUserSuperMarkets(id: string): Observable<{}> {
    return this.afs
      .collection(id)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            this.idSupermarketUser = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  public userHasSupermarketList() {
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    this.getUserSuperMarkets(userSupermarkets).subscribe(supermarkets => {
      if (supermarkets) {
        this.supermarketUserIsEmpty = Object.keys(supermarkets).length === 0;
      } else {
        this.supermarketUserIsEmpty = true;
      }
      return this.supermarketUserIsEmpty;
    });
  }

  public createUserSupermarketList(supermarketsList): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userSupermarkets.add(Object.assign({}, supermarketsList))
        .then(() => {
          resolve('This supermarket list has been correctly created.');
        })
        .catch((err) => {
          reject('There has been an error. Try again ');
        });
    });
  }

  public modifyUserSupermarketList(supermarketsList): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userSupermarkets.doc(this.idSupermarketUser).update(Object.assign({}, supermarketsList))
        .then(() => {
          resolve('This supermarket list has been correctly updated.');
        })
        .catch((err) => {
          reject('There has been an error. Try again ');
        });
    });
  }
}
