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

    public deleteItem(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.userCollection.doc(id).ref.get()
              .then((doc) => {
                  if (doc.exists) {
                      this.userCollection.doc(id).delete().then(() => {
                         // resolve('Item successfully deleted.');
                          return this.userCollection.get();
                      });
                  } else {
                      reject('There has been an error. Try again. ');
                  }
              });
        });
    }

    public editItem(id, item): Promise<string> {
        return new Promise((resolve, reject) => {
            return this.userCollection.doc(id).update(item).then(() => {
               // resolve('This document has been correctly updated.');
            })
              .catch(() => {
                  reject('There has been an error. Try again ');
              });
        });
    }

    public newItem(item: NewShoppingItem): Promise<string> {
        return new Promise((resolve, reject) => {
            this.userCollection.add(item).then(() => {
                // resolve('Item correctly created.');
            })
              .catch(() => {
                  reject('There has been an error. Try again ');
              });
        });
    }
}
