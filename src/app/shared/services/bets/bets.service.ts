import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bet, BetsList } from '../../models/bets.interface';

@Injectable({
  providedIn: 'root'
})
export class BetsService {
  userId: string;
  userBet: AngularFirestoreCollection<Bet>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        const bets = 'betsList-' + `${this.userId}`;
        this.userBet = afs.collection<BetsList>(bets);
      }
    });
  }

  public getUserBets(id: string): Observable<BetsList[]> {
    return this.afs
      .collection(id)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as BetsList;
            const idBet = a.payload.doc.id;
            return { idBet, ...data };
          })
        )
      );
  }

  public editBet(id: string, bet: Bet): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userBet.doc(id).update(bet).then(() => {
        resolve('This document has been correctly updated.');
      })
        .catch(() => {
          reject('There has been an error. Try again ');
        });
    });
  }

  public newBet(bet: Bet): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userBet.add(bet).then(() => {
        resolve('This document has been correctly created.');
      })
        .catch(() => {
          reject('There has been an error. Try again ');
        });
    });
  }
}
