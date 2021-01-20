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
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  // userLogged: User[] = [];
  userId: string = '';
  loading: boolean = false;
  shoppingListBonPreu: ShoppingList[] = [];
  shoppingListBonArea: ShoppingList[] = [];
  shoppingListAltres: ShoppingList[] = [];
  itemToCheck: string;

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
    //this.checkIfUserHasChanged();
   this.getUserLogged();
  }

  // checkIfUserHasChanged() {
  //   this.authService.watchStorage().subscribe((data:string) => {
  //     if (data === 'changed') {

  //       this.userId = '';

  //     }
  //   })

  // }

  async getData() {
    //https://stackoverflow.com/questions/52115904/how-to-call-a-function-after-the-termination-of-another-function-in-angular
    //this.shoppingLists$ = this.shoppingListService.getShoppingList();
  }

  getUserLogged() {
    (async () => {
      this.loading = true;
        await timeout(2 * 1000);
        let user = JSON.parse(localStorage.getItem('user'));
        if (typeof user === "object" && !Array.isArray(user)) {
          this.userId = user.uid;
        } else {
          this.userId = user[0].uid;
        }
        console.log(user)
        this.getShoppingList();
    })();

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
  }


  getShoppingList() {
    let userShoppingList = 'shoppingList-' + `${this.userId}`
    //this.shoppingListUser$ = this.shoppingListService.getShoppingUser(userShoppingList);
    this.shoppingListService.getShoppingUser(userShoppingList).subscribe(apps => {
    let grouppedApps = {}
    grouppedApps = groupBy(apps,"placeToBuyIt");
      console.log(grouppedApps)
      console.log(typeof(grouppedApps))
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

  checkItem(item) {
    this.itemToCheck = item
  }

  createItem(form: NewItem) {
    console.log(form)
    this.newItemForm.patchValue({checked: false})
    this.shoppingListService.newItem(form);
    this.getData();
  }
}
