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

export class ShoppingListService {
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

 


// https://firestore.googleapis.com/v1/projects/<PROJECTIDHERE>/databases/(default)/documents/<COLLECTIONNAME

  // /* Setting up user data when sign in with username/password, 
  // sign up with username/password and sign in with social auth  
  // provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  // SetShoppingList(user, userInformation) {
  //   //const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  //   const shoppingList: ShoppingList = {
  //     uid: user,
  //     shoppingList: userInformation
  //   }
  //  this.http.post(
  //   `https://ourshoppinglist-3ba7d-default-rtdb.europe-west1.firebasedatabase.app/ourshoppinglist-3ba7d-default-rtdb.json`, shoppingList
  //  ).subscribe(responseData => {
  //    console.log(responseData)
  //  });
  // }

  // public getShoppingList(): Observable<ShoppingList[]>{
  //   return this.afs.collection('shoppingLists')
  //    .snapshotChanges()
  //    .pipe(
  //      map(actions => actions.map( a => {
  //        const data = a.payload.doc.data() as ShoppingList;
  //        const id = a.payload.doc.id;
  //        return { id, ...data };
  //      }))
  //    )
  // }
 
  public getShoppingUser(id: string): Observable<ShoppingList[]>{
    return this.afs.collection(id)
     .snapshotChanges()
     .pipe(
       map(actions => actions.map( a => {
         const data = a.payload.doc.data() as ShoppingList;
         const id = a.payload.doc.id;
        //  let bonArea = a.payload.doc.data() as ShoppingList
        //  console.log(data)
         
        // if (data.placeToBuyIt === 'bonArea') {
        //   console.log('bonArea', data)
        //   this.bonArea  = data
        // }
        //  return { id, ...data, ...bonArea };
        return {id, ...data}
       }))
      //  return this.afs.collection(id)
      //  .snapshotChanges()
      //  .pipe(
      //    map(actions => actions.map( a => {
      //      const data = a.payload.doc.data() as ShoppingList;
      //      const id = a.payload.doc.id;
      //      console.log(data)
      //      console.log(id)
      //      return { id, ...data };
      //    }))
     )
     
  }

  public deleteItem(id) {
    return this.userCollection.doc(id).delete();
  }

  public editItem(id, item) {
    return this.userCollection.doc(id).update(item);
  }

  public newItem(item: NewItem) {
    // this.userCollection.add(item)
    this.userCollection.add(item)
  }
}