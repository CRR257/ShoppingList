import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supermarket } from '../../models/supermarket.interface';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  userId: string = '';
  supermarkets: Supermarket[] = []

  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {}

  getSupermarkets(): Observable<Supermarket[]> {
      return this.afs
        .collection("supermarket")
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const data = a.payload.doc.data() as Supermarket;
              console.log(data)
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
  }

  getAllSupermarkets() {
    this.getSupermarkets().subscribe(supermarket => {
      this.supermarkets = supermarket;
    });
  }

}
