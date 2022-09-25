import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CreateShoppingItemModel,
  UserShoppingListModel,
} from 'src/app/shared/models/shoppingList.interface';
import { DialogEditItemModel } from '../../shared/models/dialog.interface';
import { UtilsMathService } from '../../shared/services/utils/utils-math.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  userId = '';
  userCollection: AngularFirestoreCollection<CreateShoppingItemModel>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public utilsMathService: UtilsMathService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        const collectionsName = 'shoppingList-' + `${this.userId}`;
        this.userCollection =
          afs.collection<CreateShoppingItemModel>(collectionsName);
      }
    });
  }

  public getShoppingUser(id: string): Observable<any> {
    return this.afs
      .collection(id)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as UserShoppingListModel;
            const idShoppingList = a.payload.doc.id;
            return { idShoppingList, ...data };
          })
        )
      );
  }

  public getSortedUserShoppingList(
    shoppingList: UserShoppingListModel[]
  ): UserShoppingListModel {
    const shoppingListSorted = shoppingList.reduce(function (r: any, a: any) {
      if (a.placeToBuyIt) {
        r[a.placeToBuyIt] = r[a.placeToBuyIt] || [];
        r[a.id] = r[a.id] || '';
        r[a.placeToBuyIt].push(a);
        return r;
      }
    }, Object.create(null));
    return this.sortShoppingListSortedByNameBoughtProperty(shoppingListSorted);
  }

  sortShoppingListSortedByNameBoughtProperty(
    shoppingListSorted: UserShoppingListModel
  ): UserShoppingListModel {
    for (const key in shoppingListSorted) {
      if (shoppingListSorted) {
        // @ts-ignore
        for (let i = 0; i < shoppingListSorted[key].length; i++) {
          const supermarketSortedItems =
            this.utilsMathService.sortItemsByNameBoughtProperty(
              // @ts-ignore
              shoppingListSorted[key]
            );
          // @ts-ignore
          shoppingListSorted[key] = [];
          // @ts-ignore
          shoppingListSorted[key].push(supermarketSortedItems);
        }
      }
    }
    return shoppingListSorted;
  }

  public deleteItem(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userCollection
        .doc(id)
        .ref.get()
        .then((doc) => {
          if (doc.exists) {
            this.userCollection
              .doc(id)
              .delete()
              .then(() => {
                resolve('Item successfully deleted.');
                return this.userCollection.get();
              });
          } else {
            reject('There has been an error. Try again. ');
          }
        });
    });
  }

  public editItem(id: string, item: DialogEditItemModel): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.userCollection
        .doc(id)
        .update(item)
        .then(() => {
          resolve('This document has been correctly updated.');
        })
        .catch(() => {
          reject('There has been an error. Try again ');
        });
    });
  }

  public newItem(item: CreateShoppingItemModel): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userCollection
        .add(item)
        .then(() => {
          resolve('Item correctly created.');
        })
        .catch(() => {
          reject('There has been an error. Try again ');
        });
    });
  }
}
