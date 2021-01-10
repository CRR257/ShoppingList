import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth-service';
import { Router } from "@angular/router";
import { ShoppingListService } from 'src/app/shared/services/shoppinglist/shoppinglist.service';
import { ShoppingList, NewItem, User } from 'src/app/shared/models/user.interface';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, toArray, mergeMap } from 'rxjs/operators';
import * as groupBy from "lodash/groupBy";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userLogged: User[] = []
  userId: string = '';
  loading: boolean = false;
  shoppingListBonPreu: ShoppingList[] = [];
  shoppingListBonArea: ShoppingList[] = [];
  shoppingListAltres: ShoppingList[] = [];

  newItemForm = new FormGroup ({
    nameItem: new FormControl('', Validators.required),
    placeToBuyIt: new FormControl('', Validators.required)
  });

  constructor(public authService: AuthService,
    public shoppingListService: ShoppingListService,
    public router: Router,
    public ngZone: NgZone) {
      //this.getData()

    }

  public shoppingLists$: Observable<ShoppingList[]>;
  public shoppingListUser$: Observable<ShoppingList[]>


  ngOnInit(): void {
    this.getUserLogged();
    this.getShoppingList();
  }

  async getData() {
    //https://stackoverflow.com/questions/52115904/how-to-call-a-function-after-the-termination-of-another-function-in-angular

    this.loading = true;
    //this.shoppingLists$ = this.shoppingListService.getShoppingList();

//     let user = await this.getUsers();
//     if(this.userId) {

//    this.getShoppingList();
// }
  }

  getUserLogged() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userId = user.uid;
  }
  // getUsers() {
  //   let user = JSON.parse(localStorage.getItem('user'));
  //   this.userId = user.uid;
  // }

  getShoppingList() {
    this.loading = true;
    let userShoppingList = 'shoppingList-' + `${this.userId}`
    //this.shoppingListUser$ = this.shoppingListService.getShoppingUser(userShoppingList);
    this.shoppingListService.getShoppingUser(userShoppingList).subscribe(apps => {
      let grouppedApps = groupBy(apps,"placeToBuyIt");
      console.log(grouppedApps)
      for (let i in grouppedApps) {
        if (i === 'bonArea') {
          this.shoppingListBonArea = grouppedApps[i];
        } else if (i === 'bonPreu') {
          this.shoppingListBonPreu = grouppedApps[i];
        } else {
          this.shoppingListAltres = grouppedApps[i];
        }
      }

      console.log("bon area => ", this.shoppingListBonArea)
      console.log("bon preu => ", this.shoppingListBonPreu)
      this.loading = false;
    } );
  }

  deleteItem(item) {
    console.log(item)
  }

  editeItem(item) {
    console.log(item)
  }

  createItem(form: NewItem) {
    console.log(form)
    this.shoppingListService.newItem(form);
    this.getData();

  }
}


