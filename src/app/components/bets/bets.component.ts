import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BetsService } from '../../shared/services/bets/bets.service';
import { Bet } from '../../shared/models/bets.interface';
import {AuthService} from '../../shared/services/auth/auth-service';


@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent implements OnInit {
  userId: string;
  loading = false;
  betList: any;
  betId: string;
  cardDialog = false;
  messageCardDialog: string;

  betsForm = new FormGroup({
    text: new FormControl('')
  });

  constructor(public authService: AuthService, public betsService: BetsService) { }

  ngOnInit(): void {
    this.getUserLogged();
    this.getUserBets();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().id;
  }

  getUserBets() {
    const userBets = 'betsList-' + `${this.userId}`;
    this.betsService.getUserBets(userBets).subscribe(bets => {
      const listBets = bets;
      this.betList = listBets;
      if (this.betList.length > 0) {
        this.betList = listBets[0].text;
        this.betId = listBets[0].idBet;
      }
    });
    this.loading = false;
  }

  modifyBet(form: Bet) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const bet = {
      text: form.text
    };
    if (this.betId === undefined) {
      this.betsService.newBet(bet).then(result => {
        this.cardDialog = true;
        this.messageCardDialog = result;
      }).catch(error => {
        this.cardDialog = true;
        this.messageCardDialog = error;
      });
    } else {
      this.betsService.editBet(this.betId, bet)
        .then(result => {
        this.cardDialog = true;
        this.messageCardDialog = result;
      }).catch(error => {
        this.cardDialog = true;
        this.messageCardDialog = error;
      });
    }
  }

  closeDialog() {
    this.cardDialog = false;
  }
}
