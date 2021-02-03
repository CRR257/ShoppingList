import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BetsService } from '../../shared/services/bets/bets.service';
import { Bet } from '../../shared/models/bets.interface';


@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent implements OnInit {
  userId: string = '';
  loading: boolean = false;
  betList: any;
  betId: string;

  betsForm = new FormGroup({
    text: new FormControl('')
  })

  constructor(public betsService: BetsService) { }

  ngOnInit(): void {
    this.getUserLogged();
    this.getUserBets();
   }

   getUserLogged() {
    let userLogged = JSON.parse(localStorage.getItem('userLogged'));
    this.userId = userLogged[0].id;
  }

   getUserBets() {
    let userBets = 'betsList-' + `${this.userId}`
    this.betsService.getUserBets(userBets).subscribe(bets => {
      let listBets = bets;
      this.betList = listBets;
      if(this.betList.length > 0) {
      this.betList = listBets[0].text;
      this.betId = bets[0].id;
      }
    })
    this.loading = false;
    console.log(this.betList)
   }

   modifyBet(form: Bet) {
    let bet = {
      text: form.text
    }
     if(this.betId === undefined) {
      this.betsService.newBet(bet)
     } else {
      this.betsService.editBet(this.betId,bet)
     }
   }
}
