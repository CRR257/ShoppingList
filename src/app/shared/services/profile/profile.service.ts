import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supermarket } from '../../models/supermarket.interface';
import {AuthService} from '../auth/auth-service';
import {Bet} from "../../models/bets.interface";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userId = '';
  supermarkets: Supermarket[] = [];
  userSupermarkets: AngularFirestoreCollection<{}>;
  supermarketUserIsEmpty: boolean;
  idSupermarketUser: string;

  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public authService: AuthService
  ) {
    this.userId = this.authService.getUserLogged().id;
    const supemarketsUser = 'supermarketsUserList-' + `${this.userId}`;
    this.userSupermarkets = afs.collection<{}>(supemarketsUser);
  }

  getSupermarkets(): Observable<Supermarket[]> {
      return this.afs
        .collection('supermarket')
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const data = a.payload.doc.data() as Supermarket;
              console.log(data);
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
  }

  getUserSuperMarkets(id: string): Observable<{}> {
    console.log('id getUserSuperMarkets ', id)
    return this.afs
      .collection(id)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            this.idSupermarketUser = a.payload.doc.id;
            console.log(this.idSupermarketUser)
            // @ts-ignore
            // return { idSupermarketUser, ...data };
            return data;
          })
        )
      );
  }

  userHasSupermarketList() {
    const userSupermarkets = 'supermarketsUserList-' + `${this.userId}`;
    this.getUserSuperMarkets(userSupermarkets).subscribe(supermarkets => {
      console.log(supermarkets)
      if (supermarkets) {
        this.supermarketUserIsEmpty = Object.keys(supermarkets).length === 0;
        // this.supermarketUserIsEmpty =  Object.keys(supermarkets).length === 0 ;
        console.log('supermarketUserIsEmpty', this.supermarketUserIsEmpty);
        // this.initFormControls(supermarketUserIsEmpty);
        // return supermarketUserIsEmpty;
        // console.log(supermarkets);
        // supermarkets[0] ? this.supermarket = Object.values(supermarkets[0]) : this.initFormControls();
        // console.log(this.supermarket)
        // console.log(typeof(this.supermarket));
      } else {
        this.supermarketUserIsEmpty = true;
      }
      return this.supermarketUserIsEmpty;
    });
  }
  // getAllSupermarkets() {
  //   this.getSupermarkets().subscribe(supermarket => {
  //     this.supermarkets = supermarket;
  //   });
  // }

  createUserSupermarketList(supermarketsList) {
    console.log(this.idSupermarketUser)
    this.userSupermarkets.add(Object.assign({}, supermarketsList));
  }

  modifyUserSupermarketList(supermarketsList) {
    console.log(this.idSupermarketUser)
    this.userSupermarkets.doc(this.idSupermarketUser).update(Object.assign({}, supermarketsList));
  }

}
