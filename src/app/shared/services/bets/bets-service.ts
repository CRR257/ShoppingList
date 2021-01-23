import { Injectable, NgZone } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from "@angular/router";
// import { auth } from 'firebase/app';
import * as firebase from 'firebase';
import { User, ShoppingList, NewItem } from '../../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class BetsService {
    userId: string = '';
    //const userCollection = 'shoppingList' + this.userId;
    userCollection: AngularFirestoreCollection<NewItem>;

    shoppingList: any; // Save logged in user data
    userData: any;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth,
    public router: Router,
    private http: HttpClient,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
          this.userId = user.uid;
          let collectionsName = 'shoppingList-' + `${this.userId}`
          this.userCollection = afs.collection<NewItem>(collectionsName);
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      })

}

  public editItem(id, item) {
    return this.userCollection.doc(id).update(item);
  }

  public newItem(item: NewItem) {
    // this.userCollection.add(item)
    this.userCollection.add(item)
  }
}
