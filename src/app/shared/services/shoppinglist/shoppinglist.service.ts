import { Injectable, NgZone } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { ShoppingList, NewItem } from '../../models/user.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
    userId: string = '';
    userCollection: AngularFirestoreCollection<NewItem>;

    shoppingList: any;
    userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {

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

  public getShoppingUser(id: string): Observable<ShoppingList[]>{
    return this.afs.collection(id)
     .snapshotChanges()
     .pipe(
       map(actions => actions.map( a => {
         const data = a.payload.doc.data() as ShoppingList;
         const id = a.payload.doc.id;
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
    this.userCollection.doc(id).delete();
    return this.userCollection.get()
  }

  public editItem(id, item) {
    return this.userCollection.doc(id).update(item);
  }

  public newItem(item: NewItem) {
    this.userCollection.add(item)
  }
}
