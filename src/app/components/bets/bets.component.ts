import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BetsService } from '../../shared/services/bets/bets-service';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent implements OnInit {
  userId: string = '';
  loading: boolean = false;

  betsForm = new FormGroup({
    text: new FormControl('')
  })

  constructor(public betsService: BetsService) { }

  ngOnInit(): void {
    this.getUserLogged();
   }

   getUserLogged() {
     (async () => {
       this.loading = true;
         await timeout(2 * 1000);
         let user = JSON.parse(localStorage.getItem('userLogged'));
         if (typeof user === "object" && !Array.isArray(user)) {
           this.userId = user.uid;
         } else {
           this.userId = user[0].uid;
         }
         console.log(user)
         this.getBets();
     })();

     function timeout(ms) {
         return new Promise(resolve => setTimeout(resolve, ms));
     }
   }

   getBets() {
    let user = 'shoppingList-' + `${this.userId}`


    this.loading = false;
   }


}
