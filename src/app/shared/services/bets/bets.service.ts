import { Injectable, NgZone } from '@angular/core';
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
  userId: string = '';
  userBet: AngularFirestoreCollection<Bet>;

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
        let bets = 'betsList-' + `${this.userId}`;
        this.userBet = afs.collection<BetsList>(bets);
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
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
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  public editBet(id: string, bet: Bet) {
    this.userBet.doc(id).update(bet);
  }

  public newBet(bet: Bet) {
    this.userBet.add(bet);
  }
}
