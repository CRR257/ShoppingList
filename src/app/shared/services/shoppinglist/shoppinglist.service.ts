import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewShoppingItem, ShoppingList } from '../../models/shoppingList.interface';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  userId = '';
  userCollection: AngularFirestoreCollection<NewShoppingItem>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        const collectionsName = 'shoppingList-' + `${this.userId}`;
        this.userCollection = afs.collection<NewShoppingItem>(collectionsName);
      }
    });
  }

  public getShoppingUser(id: string): Observable<ShoppingList[]> {
    return this.afs.collection(id)
     .snapshotChanges()
     .pipe(
       map(actions => actions.map( a => {
         const data = a.payload.doc.data() as ShoppingList;
         const idShoppingList = a.payload.doc.id;
         return {idShoppingList, ...data};
       }))
     );

  }

  public deleteItem(id) {
    this.userCollection.doc(id).delete();
    return this.userCollection.get();
  }

  public editItem(id, item) {
    return this.userCollection.doc(id).update(item);
  }

  public newItem(item: NewShoppingItem) {
    this.userCollection.add(item);
  }
}
