import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewShoppingItem, ShoppingList } from '../../models/shoppingList.interface';


@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
    userId: string = '';
    userCollection: AngularFirestoreCollection<NewShoppingItem>;

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
          this.userCollection = afs.collection<NewShoppingItem>(collectionsName);
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
     )

  }

  public deleteItem(id) {
    this.userCollection.doc(id).delete();
    return this.userCollection.get()
  }

  public editItem(id, item) {
    return this.userCollection.doc(id).update(item);
  }

  public newItem(item: NewShoppingItem) {
    this.userCollection.add(item)
  }
}
